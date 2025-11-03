"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArticleType } from "@/types";
import { IoArrowBack } from "react-icons/io5";

const EditArticlePage = () => {
    const params = useParams();
    const id = params?.["id"] as string;
    const router = useRouter();
    const [article, setArticle] = useState<ArticleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [form, setForm] = useState({ title: "", description: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/articles?id=${id}`);
                const data = await res.json();
                if (data?.data) {
                    setArticle(data.data);
                    setForm({ title: data.data.title, description: data.data.description });
                } else {
                    setError(data?.error || "Article introuvable");
                }
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/articles?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || "Erreur serveur");
            router.push("/profile");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Erreur inconnue");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-10">
            <span className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!article) return null;

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen gap-4 md:gap-0">
            {/* Image à gauche sur mobile, à droite sur desktop */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-1 md:order-2">
                <div className="flex items-center justify-center w-full" style={{ perspective: "1000px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/Blog-2.png"
                        alt="Blog"
                        className="w-full h-auto object-cover rounded-xl border border-neutral-200"
                        style={{
                            transform: "rotateX(50deg) rotateZ(45deg) scale(1.2)",
                            transformStyle: "preserve-3d",
                            boxShadow: "0 25px 50px -12px rgba(182, 182, 182, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.1)",
                            willChange: 'transform'
                        }}
                    />
                </div>
            </div>

            {/* Formulaire à droite sur mobile, à gauche sur desktop */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-6 order-2 md:order-1">
                <div className="w-full max-w-md p-4 md:p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl w-full md:w-100 h-full">
                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => router.push("/articles")}
                                className="p-2 text-xl md:text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
                                title="Retour aux articles"
                            >
                                <IoArrowBack />
                            </button>
                            <h1 className="text-2xl md:text-4xl border-b border-neutral-400 mb-2">Modifier l&apos;article</h1>
                        </div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Titre de l'article"
                            value={form.title}
                            onChange={handleChange}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4 placeholder:text-sm"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description de l'article"
                            value={form.description}
                            onChange={handleChange}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4 min-h-[100px] md:min-h-[120px] placeholder:text-sm"
                            required
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="text-white bg-neutral-900 rounded-2xl p-2 text-sm md:text-base w-full mt-4 hover:bg-neutral-700 duration-300 cursor-pointer"
                        >
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        {error && (
                            <p className="text-sm text-red-600 mt-2">{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditArticlePage;
