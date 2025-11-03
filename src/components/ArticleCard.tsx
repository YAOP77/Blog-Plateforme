"use client";

import { truncateToWords } from "@/lib/utils";
import Link from "next/link";
import { getAllArticle } from "@/hook/useArticle";
import { ArticleType } from "@/types";

const AtticleCard = ({ articles: propArticles, forceNoLoading = false, onDelete, showEditDelete }: {
    articles?: ArticleType[],
    forceNoLoading?: boolean,
    onDelete?: (id: string) => void,
    showEditDelete?: (article: ArticleType) => boolean
}) => {
    const { articles: fetchedArticles, loading, error } = getAllArticle();
    const articles = propArticles ?? fetchedArticles;

    if (!forceNoLoading && loading) return (
        <div className="flex justify-center items-center py-10">
            <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
    if (!forceNoLoading && error) return <div className="p-4 text-red-600">Erreur : {error}</div>;
    if (!articles.length) return <div className="p-4">Aucun article trouvé.</div>;

    return (
        <div>
            {articles.map((article: ArticleType) => {
                return (
                    <div key={article.id} className="bg-white p-4 flex flex-col md:flex-row gap-3 max-w-6xl mb-8">
                        <div className="flex-shrink-0 md:max-w-7xl md:w-30 md:h-18">
                            <img
                                src={article.user?.avatar || "/uploads/user-default.jpg"}
                                alt="user"
                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-around md:gap-20 flex-1">
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                                    <div>
                                        <Link href={article.user?.id ? `/profile/${article.user.id}` : "#"}>
                                            <p className="text-sm md:text-lg underline font-light text-neutral-600 cursor-pointer hover:text-neural-800 transition">
                                                {article.user?.username}
                                            </p>
                                        </Link>
                                        <h3 className="text-lg md:text-2xl font-extrabold text-neutral-800 mt-1">{article.title}</h3>
                                    </div>
                                    {/* Suppression du bouton de suppression en haut */}
                                </div>
                                <p className="p-2 mt-3 border-t border-r border-neutral-400 rounded-tr-2xl text-xs md:text-sm text-neutral-700">
                                    {truncateToWords(article.description ?? "", 50)}
                                    {article.description && article.description.split(" ").length > 100 && (
                                        <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline ml-2">
                                            Lire plus
                                        </Link>
                                    )}
                                </p>
                                {article.image && (
                                    <div className="mb-2 border-r border-neutral-500 max-w-6xl mt-2">
                                        <img src={article.image} alt="article" className="w-full h-[400px] object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 md:gap-10 md:max-w-7xl flex-wrap">
                                <p className="text-[0.75em] md:text-[0.8em] text-neutral-500 p-2 flex items-center gap-2">
                                    Commentaires
                                    <span className="ml-1 font-bold text-neutral-700">{Array.isArray(article.comment) ? article.comment.length : 0}</span>
                                </p>
                                <p>
                                    <span className="text-xs md:text-sm text-neutral-500">{article.createdAt ? ` ${new Date(article.createdAt).toLocaleDateString()}` : ""}</span>
                                </p>
                            </div>
                        </div>

                            {/* Boutons d'action sous l'article */}
                            <div className="flex gap-2 md:gap-3 mt-4 md:mt-0 md:ml-4 md:self-start">
                                {showEditDelete && showEditDelete(article) && (
                                    <>
                                        {onDelete && (
                                            <button
                                                className="h-8 md:h-9 px-2 md:px-3 py-1 text-sm md:text-base bg-white text-black rounded hover:border-red-600 border border-neutral-900 transition cursor-pointer"
                                                onClick={() => onDelete(String(article.id))}
                                                title="Supprimer l'article"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                        <Link href={`/articles/edit/${article.id}`}>
                                            <button
                                                className="h-8 md:h-9 px-2 md:px-3 py-1 text-sm md:text-base bg-neutral-900 text-white rounded hover:bg-neutral-800 border border-neutral-900 transition cursor-pointer"
                                                title="Modifier l'article"
                                            >
                                                Modifier
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>


                    </div>
                );
            })}
        </div>
    );
}

export default AtticleCard