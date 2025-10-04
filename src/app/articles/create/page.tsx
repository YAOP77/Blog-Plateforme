"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";


const CreateArticlePage = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: "error" | "success"} | null >(null);

    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirige automatiquement si non connecté
    if (status === "unauthenticated") {
        if (typeof window !== "undefined") {
            router.replace("/auth/login");
        }
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!session?.user?.id) {
            setMessage({ text: "Impossible de publier : utilisateur non connecté.", type: "error" });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("userId", session.user.id);
        if (image) formData.append("image", image);
        console.log("userId envoyé :", session.user.id);
        console.log("Donnée envoyé dans formData :", formData);

        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                body: formData,
            });

            console.log("Donnée envoyé dans res", res);
            const result = await res.json();

            if (!res.ok) {
                setMessage(result.message || "Erreur lors de la publication");
            } else {
                setMessage({ text:"Article publié avec succès !", type: "success" });
                router.push("/articles");
            }
            
        } catch (error) {
            setMessage({text: "Erreur réseau ou serveur", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-10 py-6 gap-10">
        <div className="w-full md:w-1/2 max-w-md p-6">
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
                    <h1 className="text-4xl font-serif border-b border-neutral-400 mb-2">Créer un article</h1>
                </div>
                <input
                    type="text"
                    name="title"
                    placeholder="Titre de l'article"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-neutral-400 p-2 w-full mt-4"
                />
                <textarea
                    name="description"
                    placeholder="Description de l'article"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="border border-neutral-400 p-2 w-full mt-4 min-h-[120px] placeholder:text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="text-white bg-blue-600 rounded-2xl p-2 w-full mt-4 hover:bg-blue-800 duration-1000 cursor-pointer"
                >
                    {loading ? "Chargement ..." : "Créer l'article"}
                </button>
                {message?.text && (
                    <p className={ message.type === "error" ? "text-sm text-red-600 mt-2" : "text-sm text-green-600 mt-2"}>
                        { message.text }
                    </p>
                )}
            </form>
        </div>
        {/* <div className="md:max-w-4xl max-w-7xl h-full">
            <img
            src="/images/pexels-creationhill-1681010.jpg"
            className="object-cover md:max-w-3xl max-h-dvh w-7xl"
            alt="Image de création d'article"
            />
        </div> */}
        </div>
    );
};

export default CreateArticlePage;