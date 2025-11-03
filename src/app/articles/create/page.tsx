"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";


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

    // Données pour les cartes de professionnels
    const professionals = [
        { name: "Daniel", profession: "Docteur", image: "/images/user/user-01.jpg" },
        { name: "Sophie", profession: "Designer", image: "/images/user/user-02.jpg" },
        { name: "Marc", profession: "Ingénieur", image: "/images/user/user-03.jpg" },
        { name: "Emma", profession: "Marketing", image: "/images/user/user-04.jpg" },
        { name: "Lucas", profession: "Développeur", image: "/images/user/user-05.jpg" },
        { name: "Julie", profession: "Consultante", image: "/images/user/user-06.jpg" },
        { name: "Pierre", profession: "Avocat", image: "/images/user/user-07.jpg" },
        { name: "Marie", profession: "Architecte", image: "/images/user/user-08.jpg" },
        { name: "Thomas", profession: "Médecin", image: "/images/user/user-09.jpg" },
        { name: "Claire", profession: "Psychologue", image: "/images/user/user-10.jpg" },
        { name: "Antoine", profession: "Professeur", image: "/images/user/user-11.jpg" },
        { name: "Camille", profession: "Graphiste", image: "/images/user/user-12.jpg" },
        { name: "Léa", profession: "Coach", image: "/images/user/user-13.jpg" },
        { name: "Nicolas", profession: "Photographe", image: "/images/user/user-14.jpg" },
        { name: "Laura", profession: "Journaliste", image: "/images/user/user-15.jpg" },
        { name: "Alexandre", profession: "Chef", image: "/images/user/user-16.jpg" },
        { name: "Sarah", profession: "Vétérinaire", image: "/images/user/user-17.jpg" },
        { name: "Julien", profession: "Pilote", image: "/images/user/user-18.jpg" },
    ];

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
            {/* Grille de cartes à gauche sur mobile, à droite sur desktop */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-1 md:order-2" style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in"
            }}>
                <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-2xl">
                    {professionals.map((pro, index) => (
                        <div
                            key={index}
                            className="bg-neutral-300 rounded-full p-2 md:p-3 flex items-center gap-2 md:gap-3 border border-neutral-200 whitespace-nowrap"
                        >
                            {/* Image circulaire */}
                            <div className="relative w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                                <Image
                                    src={pro.image}
                                    alt={pro.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-full h-full"
                                />
                            </div>
                            {/* Nom et profession */}
                            <div className="flex flex-col">
                                <h3 className="text-[10px] md:text-sm font-bold text-neutral-900">
                                    {pro.name}
                                </h3>
                                <p className="text-[8px] md:text-xs font-normal text-neutral-600">
                                    {pro.profession}
                                </p>
                            </div>
                        </div>
                    ))}
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
                            <h1 className="text-2xl md:text-4xl border-b border-neutral-400 mb-2">Créer un article</h1>
                        </div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Titre de l'article"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4 placeholder:text-sm"
                        />
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4"
                        />
                        <textarea
                            name="description"
                            placeholder="Description de l'article"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4 min-h-[100px] md:min-h-[120px] placeholder:text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-neutral-900 rounded-2xl p-2 text-sm md:text-base w-full mt-4 hover:bg-neutral-700 duration-300 cursor-pointer"
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
            </div>
        </div>
    );
};

export default CreateArticlePage;