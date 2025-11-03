"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const user = session?.user ?? null;
    const [articles, setArticles] = useState<any[]>([]);
    const [articlesLoading, setArticlesLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        
        (async () => {
            try {
                if (user?.id) {
                    const articlesRes = await fetch(`/api/articles?userId=${user.id}`);
                    const articlesData = await articlesRes.json();
                    // Filtrer les articles pour ne garder que ceux de l'utilisateur connecté
                    const filteredArticles = (articlesData?.data ?? []).filter((article: any) => article.userId === user.id);
                    setArticles(filteredArticles);
                }
            } catch {
                setArticles([]);
            } finally {
                setArticlesLoading(false);
            }
        })();
    }, [user?.id, status]);

    if (status === "loading" || articlesLoading) return (
        <div className="flex justify-center items-center py-10">
            <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
    
    // Ne vérifier que si le statut est explicitement "unauthenticated"
    if (status === "unauthenticated") {
        return (
            <>
                <Header />
                <div className="p-8 text-center text-red-600">Utilisateur non connecté.</div>
            </>
        );
    }
    
    // Si le statut est "authenticated" mais que user est null, attendre un peu plus
    if (!user) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }
    console.log('USER DEBUG:', user);

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-0 font-serif mt-10">
                <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between mb-6 md:mb-10 gap-4">
                    <img src={user.avatar || "/uploads/user-default.jpg"} alt="avatar" className="w-32 h-32 md:w-42 md:h-42 rounded-full border-2 border-neutral-400 object-cover flex-shrink-0" />
                    <div className="text-center md:text-right min-w-[120px] md:mr-20 mt-2 md:mt-4">
                        <div className="mb-4 md:mb-6">
                            <h1 className="text-3xl md:text-6xl font-extrabold text-neutral-900 mb-2">{user.username || user.email}</h1>
                            <span>
                                <a href="/profile/edit" className="underline hover:text-neutral-500 duration-1000 cursor-pointer text-sm md:text-base">
                                    Modifier mon profil
                                </a>
                            </span>
                        </div>
                        <span className="block text-sm md:text-md text-neutral-700">Articles publiés</span>
                        <span className="text-2xl md:text-3xl font-bold text-blue-700">{articles.length}</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl font-extrabold pb-2">Mes articles</h2><hr className="text-neutral-200" />
                    <div className="absolute border-b-4 border-black w-full md:w-80" />
                    <div className="mt-10">
                        <ArticleCard
                            articles={articles}
                            forceNoLoading
                            onDelete={user ? (id: string) => {
                                // Vérifie que l'utilisateur est bien le propriétaire
                                const article = articles.find(a => a.id === id);
                                if (!article || article.userId !== user.id) return;
                                // Popup de confirmation moderne
                                const modal = document.createElement("dialog");
                                modal.style.padding = "2rem";
                                modal.style.position = "fixed";
                                modal.style.left = "50%";
                                modal.style.top = "50%";
                                modal.style.transform = "translate(-50%, -50%)";
                                modal.style.zIndex = "9999";
                                modal.innerHTML = `
                                    <form method='dialog' style='text-align:center;'>
                                        <h3 style='font-size:1.2rem;font-weight:bold;margin-bottom:1rem;'>Confirmer la suppression ?</h3>
                                        <button id='confirm' style='background:#ef4444;color:white;padding:0.5rem 1.5rem;border-radius:0.5rem;margin-right:1rem;'>Supprimer</button>
                                        <button id='cancel' style='background:#e5e7eb;color:#111;padding:0.5rem 1.5rem;border-radius:0.5rem;'>Annuler</button>
                                    </form>
                                `;
                                document.body.appendChild(modal);
                                modal.showModal();
                                return new Promise<void>((resolve) => {
                                    modal.querySelector('#confirm')?.addEventListener('click', async (e) => {
                                        e.preventDefault();
                                        try {
                                            const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
                                            const result = await res.json();
                                            if (!res.ok || result.error) throw new Error(result.error || "Erreur serveur");
                                            setArticles(prev => prev.filter(a => a.id !== id));
                                        } catch (e: any) {
                                            alert(e.message);
                                        } finally {
                                            modal.close();
                                            modal.remove();
                                            resolve();
                                        }
                                    });
                                    modal.querySelector('#cancel')?.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        modal.close();
                                        modal.remove();
                                        resolve();
                                    });
                                });
                            } : undefined}
                            showEditDelete={(article) => user && article.userId === user.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
