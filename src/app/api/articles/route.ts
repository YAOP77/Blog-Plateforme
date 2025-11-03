import { getAllArticles, deteleArticle, updateArticle, getArticlesById } from "@/controllers/articleController";
import { createArticle } from "@/controllers/articleController";
import { success, failure } from "@/lib/apiResponse";
import { writeFile } from "fs/promises";

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
        const fd = await req.formData();
        const title = fd.get("title")?.toString();
        const description = fd.get("description")?.toString();
        const userId = fd.get("userId")?.toString();
        const image = fd.get("image") as File | null;

        if(!title || !description || !userId) {
            return failure("Tous les champs son requis", 400);
        }

        const imageUrl = image && image.size > 0
        ? `/uploads/${Date.now()}-${image.name.replace(/\s+/g, "_")}`
        : null;

        if(imageUrl && image)
            await writeFile(`public${imageUrl}`, Buffer.from(await image.arrayBuffer()))

        const article = await createArticle(title, imageUrl, userId, description);
        return success(article, 201);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
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