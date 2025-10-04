import { success, failure } from "@/lib/apiResponse";
import { getArticlesById, updateArticle, deteleArticle } from "@/controllers/articleController";
import { writeFile } from "fs/promises";

export async function GET(request: Request, { params }: { params: { id: string }}): Promise<Response> {
    try {
        const id = params.id;

        if(!id || typeof id !== "string") return failure("ID invalide", 400);

        const article = await getArticlesById(id);
        return article;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }): Promise<Response> {
    try {
        const fd = await req.formData();
        const title = fd.get("title")?.toString();
        const description = fd.get("description")?.toString();
        const image = fd.get("image") as File | null;

        if(!title || !description) return failure("Les champs title et descriptons sont requis", 400)

        const imageUrl = image && image.size > 0
        ? `/uploads/${Date.now()}-${image.name.replace(/\s+/g, "_")}`
        : null

        if(imageUrl && image)
            await writeFile(`public${imageUrl}`, Buffer.from(await image.arrayBuffer()))
            
        const id = params.id;
        if(!id) return failure("ID manquant", 400);

        const edit = await updateArticle(id, {
                title,
                description,
                image: imageUrl
        });

        return success(edit, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);        
    }
}

export async function DELETE({ params }: { params: { id: string } }): Promise<Response> {
    try {
        const id = params.id;
        if(!id) return failure("ID manquant", 400);

        const removeArticle = await deteleArticle(id);
        return removeArticle;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);        
    }
}