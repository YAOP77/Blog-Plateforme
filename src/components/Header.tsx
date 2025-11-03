"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaPlus } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
// import { CiLogout } from "react-icons/ci";

const Header = () => {
    const [pathname, setPathname] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const user = session?.user ?? null;

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
    <>
        <header className="bg-white fixed left-0 top-0 right-0 w-full border-b border-neutral-200 backdrop-blur-md z-50 overflow-x-hidden">
            <nav className="flex justify-between items-center px-4 py-3 max-w-full">
                <h1 className="text-sm md:text-2xl font-bold whitespace-nowrap flex-shrink-0">
                    <Link href="/">Blog-Info</Link>
                </h1>
                
                <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
                    {/* Menu Desktop */}
                    <ul className="hidden md:flex gap-3 md:gap-6 text-xs md:text-sm items-center">
                    <li className="font-medium cursor-pointer">
                        <Link href="/">Accueil</Link>
                    </li>
                    <li className="font-medium cursor-pointer">
                        <Link href="/articles">Blog</Link>
                    </li>
                    {!loading && !user && (
                        <>
                            <li className="cursor-pointer whitespace-nowrap">
                                <Link href="/auth/login">Connexion</Link>
                            </li>
                            <li className="cursor-pointer whitespace-nowrap">
                                <Link href="/auth/register">Inscription</Link>
                            </li>
                        </>
                    )}
                    {!loading && user && (
                        <>
                            <li className="cursor-pointer flex gap-2 items-center">
                                <Link href="/profile" title="Mon profil">
                                    <Image src={user.avatar || "/uploads/user-default.jpg"} alt="profile" width={32} height={32} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-neutral-300" />
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="px-2 py-1 text-red-500 font-extrabold cursor-pointer whitespace-nowrap"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    title="Se déconnecter"
                                >
                                    Déconnexion
                                </button>
                            </li>
                        </>
                    )}
                    <li className="cursor-pointer flex items-center" title="Publié un article">
                        <Link
                            href={user ? "/articles/create" : "/auth/login"}
                            className="text-center flex items-center border p-1.5 md:p-2 bg-neutral-900 text-white hover:rounded-none rounded-2xl duration-300"
                        >
                            <span><FaPlus /></span>
                        </Link>
                    </li>
                    </ul>

                    {/* Bouton Menu Hamburger */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        <HiMenu size={20} />
                    </button>
                </div>
            </nav>
        </header>

        {/* Overlay pour fermer le menu */}
        {isMenuOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={toggleMenu}
            />
        )}

        {/* Sidebar Menu Mobile */}
        <div className={`fixed right-0 top-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Header du sidebar */}
                <div className="flex justify-between items-center p-4 border-b border-neutral-200">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition"
                        aria-label="Close menu"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                {/* Contenu du menu */}
                <ul className="flex flex-col gap-2 p-4 overflow-y-auto">
                    <li className="pb-3">
                        <Link 
                            href="/" 
                            onClick={toggleMenu}
                            className={`block py-2 font-medium ${pathname === "/articles" ? "border-l-2 border-neutral-800 pl-2" : ""}`}
                        >
                            Accueil
                        </Link>
                    </li>
                    <li className="pb-3">
                        <Link 
                            href="/articles" 
                            onClick={toggleMenu}
                            className={`block py-2 font-medium ${pathname === "/articles" ? "border-l-2 border-neutral-800 pl-2" : ""}`}
                        >
                            Blog
                        </Link>
                    </li>

                    {!loading && !user && (
                        <>
                            <li className="pb-3">
                                <Link href="/auth/login" onClick={toggleMenu} className="block py-2 text-blue-600 font-medium">
                                    Se connecter
                                </Link>
                            </li>
                            <li className="pb-3">
                                <Link href="/auth/register" onClick={toggleMenu} className="block py-2 text-blue-600 font-medium">
                                    S&apos;inscrire
                                </Link>
                            </li>
                        </>
                    )}

                    {!loading && user && (
                        <>
                            <li className="pb-3">
                                <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-2 py-2">
                                    <Image src={user.avatar || "/uploads/user-default.jpg"} alt="profile" width={40} height={40} className="w-10 h-10 rounded-full border border-neutral-300" />
                                    <span className="font-medium">Mon profil</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="text-red-500 font-extrabold w-full text-left py-2"
                                    onClick={() => {
                                        signOut({ callbackUrl: "/" });
                                        toggleMenu();
                                    }}
                                >
                                    Se déconnecter
                                </button>
                            </li>
                        </>
                    )}

                    <li className="mt-4">
                        <Link
                            href={user ? "/articles/create" : "/auth/login"}
                            onClick={toggleMenu}
                            className="flex items-center justify-center gap-2 border p-3 bg-neutral-900 text-white rounded-2xl duration-300"
                        >
                            <span><FaPlus /></span>
                            <span>Publier un article</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </>
    );
}

export default Header;