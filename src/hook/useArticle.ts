"use client"
import { getRequest, createRequest, updateRequest, deleteRequest } from "@/lib/article/fetcher";
import useSWR, { mutate } from "swr";
import { failure } from "@/lib/apiResponse";
import { ArticleType } from "@/types";

// Fonction hook pour recupérer tous les articles
export function useGetAllArticle() {
    const { isLoading, data, error } = useSWR<ArticleType[]>("/api/articles", getRequest);
    return {
        articles: data ?? [],
        loading: isLoading,
        error: error?.message ?? null
    }
}

// Fonction hook pour recupérer un article via son ID 
export function useGetArticleId(id: string) {
    const { isLoading, data, error } = useSWR<ArticleType>( id ? `/api/articles/${id}` : null, getRequest);
    return {
        article: data ?? null,
        loading: isLoading,
        error: error?.message ?? null
    }
}

// Fonction hook pour publié un article
export async function addArticle(playload: {
  title: string;
  description: string;
  image?: string | null;
  userId: string;
}) {
  const formData = new FormData();
  formData.append("title", playload.title);    
  formData.append("description", playload.description);    
  formData.append("userId", playload.userId);
  if (playload.image) formData.append("image", playload.image);

  const data = await createRequest<ArticleType>("/api/articles", "POST", formData);
  console.log("Donnée envoyé dans le hooks", data);
  return data;
}

// Fonction hook pour recupérer les données pour modifier un article
export async function updateArtile(id :string, playload: { 
    title: string, 
    description: string, 
    image?: File | null 
}) {
    const formData = new FormData();
    formData.append("title", playload.title);
    formData.append("description", playload.description);
    if(playload.image) formData.append("image", playload.image);
    
    const data = await updateRequest<ArticleType>(`/api/article/${id}`, "PATCH", formData);
    return data;
}

// Fonction hook pour supprimer un article
export async function useDelete() {
    const articleRemove = async (id: string) => {
        try {
            await deleteRequest(`/api/article/${id}`, "DELETE");
            
            mutate("/api/article");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            return failure("Erreur serveur", 500, message);
        }
    }

    return { articleRemove };
}