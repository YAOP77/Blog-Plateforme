"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"
import { IoArrowBack } from "react-icons/io5";

interface FormDataType {
    username: string,
    email: string,
    password: string
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormDataType>({
        username: "",
        email: "",
        password: ""
    });

    // const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: "error" | "success"} | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const validation = () => {
        if(!formData.username || !formData.email || !formData.password) {
            setMessage({ text: "Tous les champs sont requis", type: "error" });
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!validation()) return;

        try {
            setLoading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(formData)
            });

            if(!res.ok) {
                const data = await res.json();
                setMessage(data.message || "Erreur lors de l'inscription");
                return;
            }

            await signIn("credentials", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            router.push("/articles");
            
        } catch (error) {
            console.log("Une erreur est survenue lors de l'inscription", error);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-wrap-reverse justify-center gap-10 items-center">
            <div className="p-4 md:p-17 max-h-250 max-w-full overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl w-full md:w-100 h-full">
                    <div className="flex flex-col">
                        <button
                            type="button"
                            onClick={() => router.push("/articles")}
                            className="p-2 text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer
                            mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
                            title="Retour aux articles"
                            >
                                <IoArrowBack />
                        </button>
                        <h1 className="text-4xl font-serif border-b border-neutral-400 mb-2">Inscrez-vous</h1>
                    </div>
                    <div>                    
                        <div>
                            <input 
                                type="text"
                                name="username"
                                placeholder="Marcel"
                                onChange={handleInputChange} 
                                className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                            />
                        </div>

                        <div>
                            <input 
                                type="text"
                                name="email"
                                placeholder="Exemple@gmail.com"
                                onChange={handleInputChange}
                                className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                            /> 
                        </div>

                        <div>
                            <input 
                                type="password"
                                name="password"
                                placeholder="p@ssw0rd"
                                onChange={handleInputChange}
                                className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-blue-600 rounded-2xl
                            p-2 w-full mt-4 hover:bg-blue-800 duration-1000 cursor-pointer"
                        >
                            { loading ? "Chargement ..." : "S'iscrire" }
                        </button>
                        {/* <p className="text-sm underline my-4">Mot de passe oublié ?</p> */}
                    </div>
                    { message?.text && (
                        <p className={ message.type === "error" ? "text-sm text-red-600 duration-1000" : "text-sm text-white"}>
                            { message.text }
                        </p>
                    )}
                </form>
                <p>Vous avez un compte ? <a href="/auth/login" className="text-sm text-neutral-900">Connectez-vous</a></p>
            </div>
            <div>
                <div className="md:max-w-3xl max-w-7xl h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="object-cover md:max-w-3xl max-h-dvh w-7xl" src="/images/pexels-creationhill-1681010.jpg" alt="Background" />
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;