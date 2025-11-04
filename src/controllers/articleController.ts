import { Article } from "@prisma/client";
import { success, failure } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth";
import prisma from "@/services/prisma";
import { getServerSession } from "next-auth";
import z from "zod";

// Lire La Liste Des Articles
export async function getAllArticles({ page = 1, limit = 10, userId }: { page?: number; limit?: number; userId?: string } = {}): Promise<Article[] | Response> {
    try {
        const skip = (page - 1) * limit;
        const articles = await prisma.article.findMany({
            where: { 
                deleteAt: null,
                ...(userId && { userId })
            },
            include: {
                user: true,
                comment: {
                    where: { deleteAt: null },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        });
        return articles;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

// Lire Un Article Par Son ID
export async function getArticlesById(id: string): Promise<Response> {
    try {
        if(!id || typeof id !== "string") return failure("ID invalide", 400);

        // Lecture simple, aucune dépendance à la session
        console.log("getArticlesById - id reçu :", id);
        const article = await prisma.article.findFirst({
            where: { id, deleteAt: null },
            include: {
                user: { select: { id: true, username: true, email: true, avatar: true } },
                comment: {
                    where: { deleteAt: null },
                    include: { user: { select: { id: true, username: true, avatar: true } } }
                },
            }
        });
        console.log("getArticlesById - résultat Prisma :", article);

    if(!article) return failure("Article introuvable", 404);
    return success({ data: article });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);
    }
}

// Créer Un Articles
export async function createArticle(title: string, image: string | null, userId: string, description: string): 
Promise<Article> {
    try {
        console.log("🔍 createArticle - Vérification session...");
        const session = await getServerSession(authOptions);
        if(!session?.user?.email) {
            console.error("❌ Pas de session ou email");
            throw new Error("Accès non autorisé - pas de session");
        }

        console.log("🔍 createArticle - Recherche utilisateur:", session.user.email);
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });

        if(!user) {
            console.error("❌ Utilisateur non trouvé");
            throw new Error("Accès non autorisé - utilisateur non trouvé");
        }

        console.log("💾 createArticle - Création article en DB...");
        const create = await prisma.article.create({
            data: {
                title,
                image,
                userId: user.id,
                description
            }
        });

        console.log("✅ Article créé:", create.id);
        return create;
    } catch (error: unknown) {
        console.error("❌ Erreur dans createArticle:", error);
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        throw new Error(`Erreur création article: ${message}`);
    }
}

// export async function createArticle(title: string, image: string | null, userId: string, description: string): 
// Promise<Article | Response> {
//     try {
//         return prisma.article.create({
//             data: {
//                 title,
//                 image,
//                 userId,
//                 description
//             }
//         });
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : "Erreur inconnu";
//         return failure("Erreur serveur", 500, message);
//     }
// }

const updateArticleSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    image: z.string().url().optional()
})

export async function updateArticle(id: string, data: { 
    title: string; 
    description: string; 
    image?: string | null 
}): Promise<Response> {
    try {
        if(!id) return failure("ID manquant", 400);

        const session = await getServerSession(authOptions);
        if(!session?.user?.email) return failure("Unauthorization", 401);

        const parsed = updateArticleSchema.safeParse(data);
        if(!parsed.success) return failure("La validation a échoué", 422, parsed.error.format());

        const article = await prisma.article.findUnique({ where: { id } });
        if(!article || article.deleteAt) return failure("Article introuvable", 404);

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if(!user || user.id !== article.userId) return failure("Accès refusé", 403);

        const update = await prisma.article.update({
            where: { id },
            data: parsed.data
        });

        return success(update , 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

export async function deteleArticle(id: string): Promise<Response> {
    try {
        if(!id) return failure("ID manquant", 400);

        const session = await getServerSession(authOptions);
        if(!session?.user?.email) return failure("Accès non autorisé", 401);

        const article = await prisma.article.findUnique({ where: { id } });
        if(!article || article.deleteAt) return failure("Article introuvable", 404);

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if(!user || user.id !== article.userId) return failure("Accès refusé", 403);

        const remove = await prisma.article.update({
            where: { id },
            data: { deleteAt: new Date() }
        });

        return success(remove, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}