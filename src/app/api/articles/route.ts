import { getAllArticles, deteleArticle, updateArticle, getArticlesById } from "@/controllers/articleController";
import { createArticle } from "@/controllers/articleController";
import { success, failure } from "@/lib/apiResponse";
import { put } from "@vercel/blob";

// // Lire La Liste Des Articles
export async function GET(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (id) {
            return await getArticlesById(id);
        }
        // Pagination
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const userId = searchParams.get("userId");
        const articles = await getAllArticles({ page, limit, userId: userId || undefined });
        return success({ data: articles }, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}
// Modifier Un Article
export async function PUT(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return failure("ID manquant", 400);
        const body = await req.json();
        const { title, description } = body;
        if (!title || !description) return failure("Champs manquants", 400);
        return await updateArticle(id, { title, description });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}


// // Créer Un Article
export async function POST(req: Request): Promise<Response> {
    try {
        console.log("📥 POST /api/articles - Début");
        
        const fd = await req.formData();
        const title = fd.get("title")?.toString();
        const description = fd.get("description")?.toString();
        const userId = fd.get("userId")?.toString();
        const image = fd.get("image") as File | null;

        console.log("📋 Données reçues:", {
            title: title?.substring(0, 50),
            description: description?.substring(0, 50),
            userId,
            hasImage: !!image,
            imageSize: image?.size,
            imageType: image?.type,
        });

        if(!title || !description || !userId) {
            console.log("❌ Champs manquants");
            return failure("Tous les champs sont requis", 400);
        }

        let imageUrl: string | null = null;

        // Upload vers Vercel Blob si une image est fournie
        if (image && image.size > 0) {
            console.log("📤 Upload image vers Vercel Blob...");
            try {
                const blob = await put(image.name, image, {
                    access: 'public',
                    addRandomSuffix: true,
                });
                imageUrl = blob.url;
                console.log("✅ Image uploadée:", imageUrl);
            } catch (blobError) {
                console.error("❌ Erreur upload Blob:", blobError);
                const blobMessage = blobError instanceof Error ? blobError.message : "Erreur upload";
                return failure("Erreur lors de l'upload de l'image", 500, blobMessage);
            }
        } else {
            console.log("ℹ️ Pas d'image à uploader");
        }

        console.log("💾 Création de l'article en base de données...");
        const article = await createArticle(title, imageUrl, userId, description);
        console.log("✅ Article créé:", article.id);
        
        return success(article, 201);
    } catch (error: unknown) {
        console.error("❌ Erreur serveur:", error);
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        const stack = error instanceof Error ? error.stack : undefined;
        console.error("Stack:", stack);
        return failure("Erreur serveur", 500, message);
    }
}

// // Supprimer Un Article
export async function DELETE(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return failure("ID manquant", 400);
        const result = await deteleArticle(id);
        // Toujours renvoyer un JSON valide
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}