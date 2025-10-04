"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const EditProfilePage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: "error" | "success"} | null >(null);

    // Récupère les infos actuelles de l'utilisateur (optionnel, à améliorer si besoin)
    // ...

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatar(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("username", username);
        if (avatar) formData.append("avatar", avatar);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                body: formData,
            });
            const result = await res.json();
            if (!res.ok) {
                setMessage(result.message || "Erreur lors de la modification");
            } else {
                setMessage({ text: "Profil modifié avec succès !", type: "success" });
                setTimeout(() => router.push("/profile"), 1200);
            }
        } catch (error) {
            setMessage({text: "Erreur réseau ou serveur", type: "error" });
        } finally {
            setLoading(false);
        }
    };

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
                                &#8592;
                            </button>
                            <h1 className="text-4xl font-serif border-b border-neutral-400 mb-2">Modifier mon profil</h1>
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                            required
                        />
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="border border-neutral-400 p-2 w-full mt-4"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-blue-600 rounded-2xl p-2 w-full mt-4 hover:bg-blue-800 duration-1000 cursor-pointer"
                        >
                            {loading ? "Chargement ..." : "Enregistrer"}
                        </button>
                        {message?.text && (
                            <p className={ message.type === "error" ? "text-sm text-red-600 mt-2" : "text-sm text-green-600 mt-2"}>
                                { message.text }
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfilePage;
