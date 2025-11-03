"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getArticleId } from "@/hook/useArticle";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import CommentSection, { Comment } from "@/components/CommentSection";

const ArticleDetailPage = () => {
    const params = useParams();
    const id = params?.["id"] as string;
    const { article, loading, error } = getArticleId(id);
    const router = useRouter();

    // Gestion dynamique des commentaires (hook AVANT tout return)
    const [comments, setComments] = React.useState<Comment[]>([]);

    // Utilisateur connecté (via useSession)
    const { data: session } = useSession();
    const currentUser = session?.user ?? null;

    // Publication du commentaire via l'API et mise à jour instantanée
    const handlePublish = async (text: string) => {
        try {
            const res = await fetch("/api/comments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId: id, text })
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || "Erreur serveur");
            setComments(prev => [
                {
                    id: result.data.id,
                    description: result.data.description,
                    user: {
                        username: result.data.user.username,
                        avatar: result.data.user.avatar || "/uploads/user-default.jpg"
                    },
                    userId: result.data.userId
                },
                ...prev
            ]);
        } catch (e: any) {
            alert(e.message);
        }
    };

    // Remplit les commentaires à la première récupération de l'article
    React.useEffect(() => {
        if (Array.isArray(article?.comment)) {
            setComments(
                article.comment.map((c: any) => ({
                    id: c.id,
                    description: c.description,
                    user: {
                        username: c.user?.username || "Utilisateur",
                        avatar: c.user?.avatar || "/uploads/user-default.jpg"
                    },
                    userId: c.userId
                }))
            );
        } else {
            setComments([]);
        }
    }, [article?.comment]);

    if (loading) return (
        <div className="flex justify-center items-center py-10">
            <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
    if (error || !article) return <div className="p-4 text-red-600">Erreur : {error || "Article introuvable"}</div>;

    return (
        <div className="font-serif">
            <article className="w-full max-w-4xl mx-auto px-2 md:px-0 mt-10 mb-16">
                <header className="flex items-center gap-4 mb-6">
                    <div className="flex justify-between w-300">
                        <div className="flex gap-4 items-center">
                            <img
                                src={article.user?.avatar || "/uploads/user-default.jpg"}
                                alt={article.user?.username || "Utilisateur"}
                                className="w-14 h-14 rounded-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/uploads/user-default.jpg";
                                }}
                            />
                            <div>
                                <a
                                    href={`/profile/${article.user?.id}`}
                                    className="font-semibold text-lg text-blue-700 hover:underline"
                                    title={`Voir le profil de ${article.user?.username}`}
                                >
                                    {article.user?.username || "Utilisateur"}
                                </a>
                                <div className="text-sm text-neutral-500 mt-1">Publié le {new Date(article.createAt ?? article.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="p-2 text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
                                title="Retour"
                            >
                                <IoArrowBack />
                            </button>
                        </div>
                    </div>
                </header>
                <h1 className="text-4xl font-extrabold mb-6 text-neutral-900 leading-tight">
                    {article.title}
                </h1>
                {article.image && (
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={900}
                        height={500}
                        className="object-cover mb-8 w-full h-[350px] md:h-[450px]"
                    />
                )}
                <div className="w-full mt-4">
                    <p className="text-lg text-neutral-700 whitespace-pre-line leading-relaxed">
                        {article.description}
                    </p>
                </div>
            </article>
            <CommentSection
                comments={comments}
                onPublish={handlePublish}
                currentUser={currentUser}
                onDelete={async id => {
                    try {
                        const res = await fetch(`/api/comments/delete?id=${id}`, { method: "DELETE" });
                        const result = await res.json();
                        if (!res.ok || result.error) throw new Error(result.error || "Erreur serveur");
                        setComments(prev => prev.filter(c => c.id !== id));
                    } catch (e: any) {
                        alert(e.message);
                    }
                }}
            />
    </div>
    );
};

export default ArticleDetailPage;
