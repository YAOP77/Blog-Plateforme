"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoArrowBack } from "react-icons/io5";

const EditProfilePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: "error" | "success"} | null >(null);

    // Pré-remplir le formulaire avec les données actuelles de l'utilisateur
    useEffect(() => {
        if (status === "authenticated" && session?.user?.username) {
            setUsername(session.user.username);
        }
    }, [session, status]);

    // Rediriger si non authentifié
    if (status === "unauthenticated") {
        if (typeof window !== "undefined") {
            router.replace("/auth/login");
        }
        return null;
    }

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
                // Forcer un rechargement complet pour rafraîchir la session NextAuth depuis le serveur
                // Le callback session dans auth.ts récupérera les nouvelles données de la base de données
                setTimeout(() => {
                    window.location.href = "/profile";
                }, 1000);
            }
        } catch (error) {
            setMessage({text: "Erreur réseau ou serveur", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen gap-4 md:gap-0">
            {/* Image à gauche sur mobile, à droite sur desktop */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-1 md:order-2">
                <div className="flex items-center justify-center w-full" style={{ perspective: "1000px" }}>
                    <img
                        src="/images/Blog-Ex.png"
                        alt="Blog"
                        className="w-full h-auto object-cover rounded-xl border border-neutral-200"
                        style={{
                            transform: "rotateX(50deg) rotateZ(45deg) scaleY(0.75) scale(1.2)",
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
                                onClick={() => router.push("/profile")}
                                className="p-2 text-xl md:text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
                                title="Retour au profil"
                            >
                                <IoArrowBack />
                            </button>
                            <h1 className="text-2xl md:text-4xl border-b border-neutral-400 mb-2">Modifier mon profil</h1>
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4 placeholder:text-sm"
                            required
                        />
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="border border-neutral-400 p-2 text-sm md:text-base w-full mt-4"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-neutral-900 rounded-2xl p-2 text-sm md:text-base w-full mt-4 hover:bg-neutral-700 duration-300 cursor-pointer"
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
        </div>
    );
};

export default EditProfilePage;
