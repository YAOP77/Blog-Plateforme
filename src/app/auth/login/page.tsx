"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.email || !formData.password) {
      setMessage({ text: "Tous les champs sont requis", type: "error" });
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setMessage({ text: "Email ou mot de passe incorrect", type: "error" });
      setLoading(false);
    } else {
      router.push("/article");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen px-4 md:px-10 py-6 gap-10">
      {/* Formulaire */}
      <div className="w-full md:w-1/2 max-w-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl w-100 h-full">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 text-2xl text-neutral-400 hover:underline duration-700 cursor-pointer
              mb-2 w-fit rounded-full border border-neutral-300 hover:text-neutral-600 hover:border-neutral-400"
              title="Cliquer pour revenir en arrière"
            >
              <IoArrowBack />
            </button>
            <h1 className="text-4xl font-serif border-b border-neutral-400 mb-2">Connectez-vous</h1>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Se connecter avec un compte existant</p>
            <div className="text-sm mt-2 max-w-22 text-left px-1 py-1 border border-neutral-300 
              hover:border hover:border-neutral-400 duration-500 rounded-2xl">
                <a 
                  className="flex items-center gap-2 cursor-pointer" 
                  onClick={() => signIn("google")}
                >
                  <FcGoogle size={17} /> Google
                </a>
            </div>

            <input 
              type="text"
              name="email"
              placeholder="Exemple@gmail.com"
              onChange={handleInputChange}
              className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
            /> 

            <input 
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleInputChange}
              className="border border-neutral-400 p-2 w-full mt-4 placeholder:text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-600 rounded-2xl
              p-2 w-full mt-4 hover:bg-blue-800 duration-1000 cursor-pointer"
            >
              { loading ? "Chargement ..." : "Se connecter" }
            </button>
          </div>

          { message?.text && (
            <p className={`text-sm ${message.type === "error" ? "text-red-600 translate-x-1 transition-transform duration-300" : "text-white"}`}>
              { message.text }
            </p>
          )}

          <p className="mt-4 text-sm text-neutral-700">
            Pas de compte ? <a href="/auth/register" className="text-sm text-neutral-900 underline">Créer votre compte</a>
          </p>
        </form>
      </div>

      {/* Image */}
      <div className="md:max-w-4xl max-w-7xl h-full">
        <img
          src="/images/pexels-tima-miroshnichenko-6170398.jpg"
          className="object-cover md:max-w-3xl max-h-dvh w-7xl"
          alt="Image de connexion"
        />
      </div>
    </div>
  );
};

export default LoginPage;