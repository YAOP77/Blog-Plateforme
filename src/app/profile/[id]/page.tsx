"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import { ArticleType } from "@/types";
import Image from "next/image";

interface User {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
}

export default function ProfileIdPage() {
    const params = useParams();
    const userId = params?.id as string;
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;
    
    const [user, setUser] = useState<User | null>(null);
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        (async () => {
            try {
                const articlesRes = await fetch(`/api/articles?userId=${userId}`);
                if (!articlesRes.ok) {
                    setError("Utilisateur non trouvé");
                    setLoading(false);
                    return;
                }
                
                const articlesData = await articlesRes.json();
                // Filtrer les articles pour ne garder que ceux de l'utilisateur concerné
                const filteredArticles = (articlesData?.data ?? []).filter((article: ArticleType) => article.userId === userId);
                setArticles(filteredArticles);

                if (filteredArticles.length > 0) {
                    const firstArticle = filteredArticles[0];
                    setUser({
                        id: firstArticle.userId,
                        username: firstArticle.user?.username || "Utilisateur",
                        email: firstArticle.user?.email || "",
                        avatar: firstArticle.user?.avatar || null
                    });
                } else {
                    // Si aucun article, essayer de récupérer les infos utilisateur autrement
                    // Pour l'instant, on crée un utilisateur par défaut
                    setUser({
                        id: userId,
                        username: "Utilisateur",
                        email: "",
                        avatar: null
                    });
                }
            } catch (err) {
                setError("Erreur lors du chargement");
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center py-10">
                    <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                </div>
            </>
        );
    }

    if (error || !user) {
        return (
            <>
                <Header />
                <div className="p-8 text-center">
                    <p className="text-red-600">Utilisateur non trouvé</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-0 font-serif mt-10">
                <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between mb-6 md:mb-10 gap-4">
                    <Image 
                        src={user.avatar || "/uploads/user-default.jpg"} 
                        alt="avatar"
                        width={168}
                        height={168}
                        className="w-32 h-32 md:w-42 md:h-42 rounded-full border-2 border-neutral-400 object-cover flex-shrink-0" 
                    />
                    <div className="text-center md:text-right min-w-[120px] md:mr-20 mt-2 md:mt-4">
                        <div className="mb-4 md:mb-6">
                            <h1 className="text-3xl md:text-6xl font-extrabold text-neutral-900 mb-2">
                                {user.username || user.email}
                            </h1>
                        </div>
                        <span className="block text-sm md:text-md text-neutral-700">Articles publiés</span>
                        <span className="text-2xl md:text-3xl font-bold text-blue-700">{articles.length}</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl font-extrabold pb-2">Ses articles</h2>
                    <hr className="text-neutral-200" />
                    <div className="absolute border-b-4 border-black w-full md:w-80" />
                    <div className="mt-10">
                        <ArticleCard
                            articles={articles}
                            forceNoLoading
                            showEditDelete={(article) => !!(currentUserId && String(currentUserId) === String(article.userId))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
