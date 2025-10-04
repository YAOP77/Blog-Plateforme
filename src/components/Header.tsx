"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { FaPlus } from "react-icons/fa6";
// import { CiLogout } from "react-icons/ci";

const Header = () => {
    const [pathname, setPathname] = useState("");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPathname(window.location.pathname);
        (async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.headers.get("content-type")?.includes("application/json")) {
                    const session = await res.json();
                    setUser(session?.user ?? null);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
    <header className="bg-white p-3 fixed left-0 top-0 right-0 w-full border-b border-neutral-200 backdrop-blur-md z-50 font-serif">
            <nav className="flex flex-wrap justify-between items-center">
                <ul>
                    <li className="text-2xl font-bold">
                        <a href="/">Blog-Info</a>
                    </li>
                </ul>
                <ul className="absolute right-0 mt-7 mr-4 flex flex-wrap justify-center gap-6 text-sm items-center">
                    <li className={`pb-2 font-medium cursor-pointer ${pathname === "/articles" ? "border-b-2 border-transparent" : "border-b-2 border-neutral-800"}`}>
                        <a href="/">Accueil</a>
                    </li>
                    <li className={`pb-2 font-medium cursor-pointer ${pathname === "/articles" ? "border-b-2 border-neutral-800" : "border-b-2 border-transparent"} hover:border-neutral-800 transition`}>
                        <a href="/articles">Blog</a>
                    </li>
                    {!loading && !user && (
                        <>
                            <li className="pb-2 border-b-2 border-transparent hover:border-neutral-800 transition cursor-pointer">
                                <a href="/auth/login">Se connecter</a>
                            </li>
                            <li className="pb-2 border-b-2 border-transparent hover:border-neutral-800 transition cursor-pointer">
                                <a href="/auth/register">S'inscrire</a>
                            </li>
                        </>
                    )}
                    {!loading && user && (
                        <>
                            <li className="cursor-pointer pb-4 flex gap-2 items-center">
                                <a href="/profile" title="Mon profil">
                                    <img src={user.avatar || "/uploads/user-default.jpg"} alt="profile" className="w-8 h-8 rounded-full border border-neutral-300" />
                                </a>
                            </li>
                            <li>
                                <button
                                    className="px-3 py-1 pb-4 text-red-500 font-extrabold cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    title="Se déconnecter"
                                >
                                    Se deconnecter
                                    {/* <CiLogout size={25} /> */}
                                </button>
                            </li>
                        </>
                    )}
                    <li className="pb-2 cursor-pointer flex items-center" title="Publié un article">
                        <a
                            href={user ? "/articles/create" : "/auth/login"}
                            className="text-center flex items-center border p-2 mb-2 bg-neutral-900 text-white hover:rounded-none rounded-2xl duration-300"
                        >
                            <span><FaPlus /></span>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;