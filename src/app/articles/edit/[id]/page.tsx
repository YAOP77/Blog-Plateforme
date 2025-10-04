"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
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
            } catch (e: any) {
                setError(e.message);
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
        } catch (e: any) {
            setError(e.message);
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
        <>
            <Header />
            <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-10 py-6 gap-10">
                <div className="w-full md:w-1/2 max-w-md p-6 bg-white rounded-xl shadow">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl w-100 h-full">
                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="p-2 text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
                                title="Retour"
                            >
                                <IoArrowBack />
                            </button>
                            <h1 className="text-4xl font-serif border-b border-neutral-400 mb-2">Modifier l'article</h1>
                        </div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Titre de l'article"
                            value={form.title}
                            onChange={handleChange}
                            className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description de l'article"
                            value={form.description}
                            onChange={handleChange}
                            className="border border-neutral-400 p-2 w-full mt-4 min-h-[120px] placeholder:text-sm"
                            required
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="text-white bg-blue-600 rounded-2xl p-2 w-full mt-4 hover:bg-blue-800 duration-1000 cursor-pointer"
                        >
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        {error && (
                            <p className="text-sm text-red-600 mt-2">{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditArticlePage;
