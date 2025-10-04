// ///////////////////////////////////////// :Creattion du context utilisateur:
import React, { createContext, useState, ReactNode, FormEvent } from "react";

interface UserType {
    id: number;
    username: string;
    email: string;
}

interface UserContextType {
    user: UserType | null,
    setUser: (user: UserType | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [ user, setUser ] = useState<UserType | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    )
}

//////////////////////////// :BUTTON:

interface ButtonType {
    label: string;
    onClick: () => void;
    type: "button" | "submit" | "reset";
    className: string
}

const Button = ({ label, onClick, type="button", className="" }: ButtonType) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-2 py-2 bg-blue-600 hover:bg-blue-800 ${className}`}
        >
            { label }
        </button>
    )
}

////////////////////////////// :Config pour une communication unique à la DB via l'instance PrismaClient:
import { PrismaClient } from "@prisma/client";

const globalPrismaState = global as unknown as { prisma: PrismaClient };

const prisma = globalPrismaState.prisma || new PrismaClient({ log: ["query"] });

if(process.env.NODE_ENV !== "production") globalPrismaState.prisma = prisma;

///////////////////////////// :Gestionnaire de connexion NextAuth:
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if(!user) return null;

                const isMatch = await compare(credentials.password, user.password);
                if(!isMatch) return null;

                return user;
            }
        })
    ],

    pages: { signIn: "/auth/login" },
    session: { strategy: "jwt" },
});

// export { handler as GET, handler as POST };

////////////////////////////////////////////// :Formulaire d'inscription:
import { signIn } from "next-auth/react";
import { Router, useRouter } from "next/router";

interface FormDateType {
    username: string,
    email: string,
    password: string
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormDateType>({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const validation = () => {
        if(!formData.username || !formData.email || !formData.password) {
            setError("Tous les champs sont requis");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!validation()) return;

        try {
            setLoading(true);
            const res = await fetch("api/user/register", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(formData)
            });

            if(!res.ok) {
                const data = await res.json()
                setError(data.message || "Erreur lors de l'inscription")
                setLoading(false);
                return;
            }

            await signIn("credentials", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            router.push("/");
        } catch (error) {
            
        }
    }
}

////////////////////////////////////////////////////// :Service pour les entrées utilisateurs:
import { hash } from "bcrypt";
// import prisma from "@/services/prisma";

export async function createUser(username: string, email: string, password: string) {
    const hashedPassword = hash(password, 10);
    
    return prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })
}

//////////////////////////////////////////////////
import { NextResponse } from "next/server";

export function success(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export function failure(message: string, status = 500, details?: any) {
    return NextResponse.json({ error: message, details }, { status });
}

/////////////////////////////////////////////////
// import { createUser } from "@/services/userService";
// import { success, failure } from "@/lib/apiResponse";

export async function POST(req: Request) {
    try {
        // const { username, email, password } = req.json();
        // await createUser(username, email, password);

        return success({ message: "Inscription réussi" }, 201)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message)
    }
}

////////////////////////////////////////////////////////// :CRUD ARTICLE:
// import { Article } from "@/generated/prisma";
// // import { failure } from "@/lib/apiResponse";

export async function getAllService(): Promise<Article[] | Response> {
    try {
        const articles = await prisma.article.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });

        return articles;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

// export async function createArticle(
//     title: string, 
//     description: string, 
//     userId: string, 
//     image: string | null
// ): Promise<Article | null> {
//     try {
//         return prisma.article.create({
//             data: {
//                 title,
//                 description,
//                 image,
//                 userId
//             }
//         });
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : "Erreur inconnu";
//         return failure("Erreur serveur", 500);
//     }
// }

///////////////////////////////////////////////// :API ROUTE:
// import { getAllArticles } from "@/controllers/articleController";
import { writeFile } from "fs/promises";

export async function GET(): Promise<Response> {
    try {
        const article = await getAllArticles();
        return success(article, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

// ROUTE.TS
// export async function POST(req: Request): Promise<Response> {
//     try {
//         const fd = await req.formData();
//         const title = fd.get("title")?.toString();
//         const description = fd.get("description")?.toString();
//         const userId = fd.get("userId")?.toString();
//         const image = fd.get("image") as File | null;

//         if(!title || !description || !userId) {
//             return failure("Tous les champs sont requis", 400);
//         }

//         const imageUrl = image && image.size > 0
//         ? `/uploads/${Date.now()}-${image.name.replace(/\s+/g, "_")}`
//         : null;

//         if(imageUrl && image)
//             await writeFile(`public${imageUrl}`, Buffer.from(await image.arrayBuffer()));

//         const article =  await createArticle(title, description, userId, imageUrl);
//         return success(article, 201);
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : "Erreur inconnu";
//         return failure("Erreur serveur", 500, message);
//     }
// }

///////////////////////////////////////////////////////////////// :CRUD ARTICLE CONTROLLERS:
import { Article } from "@/generated/prisma";

export async function getArticleById(id: string): Promise<Response> {
    try {
        if(!id || typeof id !== "string") return failure("ID non valide", 400);

        const article = await prisma.article.findFirst({
            where: { id, deleteAt: null },
            include: {
                user: { select: { id: true, username: true, email: true } },
                comments: { where: { deleteAt: null }, include: { user: { select: { id: true, username: true } } } } 
            }
        })

        if(!article) return failure("Article introuvable", 404);
        return success(article, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

///////////////////////////////////////////////////////////////// :CRUD ARTICLE ROUTE.TS:

// export async function GET(req: Request, { params }: { params: { id: string } }): Promise<Response> {
//     try {
//         const id = params.id;

//         if(!id || typeof id !== "string") return failure("ID invalide", 400);

//         const article = await getArticleById(id);
//         if(!article) return failure("Article introuvable", 404);
//         return article;
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : "Erreur inconnue";
//         return failure("Erreur serveur", 500, message);
//     }
// }

/////////////////////////////////////////// /lib/fechter.ts
import useSWR, { mutate } from "swr";
import { ArticleType } from "@/types";

const fetcher = async (url: string): Promise<ArticleType> => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Erreur inconnue");
  return data.data;
};

export async function pathArticle<T>(url: string, method: string, formData: FormData): Promise<T> {
    const res = await fetch(url, { method, body: formData});
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnu");
    return data.data;
}

/////////////////////////////////////////////////// hooks
// ALL
export function getAllArticles() {
    const { isLoading, data, error } = useSWR(`/api/article/all`, fetcher);
    return {
        articles: data ?? [],
        loading: isLoading,
        error: error?.message ?? null
    }
}

// BY ID
export function getArticleId(id: string) {
  const { isLoading, data, error } = useSWR( id ? `/api/article/${id}`: null, fetcher);

  return {
    article: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}

// UPDATE
export async function updArticle(id: string, playload: {
    title: string,
    description: string,
    image?: File | null
}) {
    const formData = new FormData();
    formData.append("title", playload.title);
    formData.append("description", playload.description);
    if(playload.image) formData.append("image", playload.image);

    const res = await fetch(`/api/article/${id}`, {
        method: "PATH",
        body: formData
    });

    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnu");
    return data.data;
}

//////////////////////////////////////
import z, { json, string } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const updateArticleSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    image: z.string().url().optional
});

export async function updateArticle(req: Request, id: string, data: { title: string, description: string, image: File | null }) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.email) return failure("Unauthorization", 401);

        if(!id || typeof id !== "string") return failure("ID invalide", 400);
        
        const parsed = updateArticleSchema.safeParse(data);
        if(!parsed.success) return failure("La validation a échoé", 422, parsed.error.format());

        const article = await prisma.article.findUnique({ where: { id } });
        if(!article || article.deleteAt) return failure("Article introuvable", 404);

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if(!user || user.id !== article.userId) return failure("Accès refusé", 403);

        const update = await prisma.article.update({
            where: { id },
            data: parsed.data
        });

        return update;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);
    }
}

///////////////////////////////////////////// :Controller Articles
import prisma from "@/services/prisma";
import { updateArtile } from "@/hook/useArticle";

const updateArticleSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    image: z.string().url().optional()
});

export async function updateArticle(req: Request, id: string, data: {
    title: string,
    description: string,
    image?: File | null
}): Promise<Response> {
    try {
        const id = await params.id;
        if(!id || typeof id !== "string") return failure("ID invalide", 400)

        const session = getServerSession(authOptions);
        if(!session?.user?.email) return failure("Non authorisé ");

        const parsed = updateArticleSchema.safeParse(data);
        if(!parsed.success) return failure("La validation a échoué", 422, parsed.error.format());

        const articles = await prisma.article.findUnique({ where: { id } });
        if(!articles || articles.deleteAt) return failure("Article introuvable", 404);

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if(!user || user.id !== articles.id) return failure("Accès refusé", 403);

        const update = await prisma.article.update({
            where: { id },
            data: parsed.data
        });

        return success(update, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

// export async function fetchUpdate<T>(url: string, method: string, formData: FormData): Promise<T> {
//     const res = await fetch(url, { method, body: formData});
//     const data = await res.json();

//     if(!res.ok) throw new Error(data.message || "Erreur inconnue");
//     return data.data;
// }

export async function updArticle(id: string, playload: {
    title: string,
    description: string,
    image?: File | null
}) {
    const formdata = new FormData();
    formdata.append("title", playload.title);
    formdata.append("description", playload.description);
    if(playload.image) formdata.append("image", playload.image);

    const res = await fetch(`/api/article/${id}`, {
        method: "PATH",
        body: formdata
    });

    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnu");
    return data.data;
}

// export async function PATH(req: Request, { params }: { params: { id: string } }): Promise<Response> {
//     try {
//         const fd = await req.formData();
//         const title = fd.get("title")?.toString();
//         const description = fd.get("description")?.toString();
//         const image = fd.get("image") as File | null;

//         if(!title || !description) return failure("Les champs title et description sont requis");

//         const imageUrl = image && image.size > 0
//         ? `/uploads/${Date.now()}-${image.name.replace(/\s+/g, "_")}`
//         : null;

//         if(imageUrl && image)
//             await writeFile(`public${imageUrl}`, Buffer.from(await image.arrayBuffer()));

//         const id = await params.id;
//         if(!id || typeof id !== "string") return failure("ID invalide", 400);

//         const edit = await updateArticle(req, id, {
//             title,
//             description,
//             image: imageUrl
//         });

//         return edit;
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : "Erreur inconnue";
//         return failure("Erreur serveur", 500, message);
//     }
// }

export async function removeArticle(req: Request, { params }: { params: { id: string } }): Promise<Response> {
    try {
        const id = params.id;
        if(!id || typeof id !== "string") return failure("ID invalide", 400);

        const session = await getServerSession(authOptions);
        if(!session?.user?.email) return failure("Accès non autorisé", 401);

        const article = await prisma.article.findUnique({ where: { id } });
        if(!article || article.deleteAt) return failure("Article introuvable", 404);

        const user = await prisma.user.findUnique({ where: { email: session.user.email }});
        if(!user || user.id !== article.userId) return failure("Accès refusé", 403);

        const remove = await prisma.article.update({
            where: { id },
            data: { deleteAt: new Date }
        });

        return success(remove, 200);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

export async function deleteRequest(url: string): Promise<void> {
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnu");
}

export async function useDelete() {
    const removeArt = (id: string) => {
        try {
                deleteRequest(`/api/article/${id}`);

                mutate("/api/article");
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Erreur inconnu";
                return failure("Erreur serveur", 500, message);        
            }
    }

    return { removeArt };
}

/////////////////////////////////////////////////////////////
import { success, failure } from "@/lib/apiResponse";

// CONTROLLER
export async function addUser(username: string, email: string, avatar: string, password: string): Promise<Response> {
    try {
        const pwHash = await hash(password, 10);
        
        const user = await prisma.user.create({
            username,
            email,
            avatar,
            password: pwHash
        });

        return success(user, 201);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return failure("Erreur serveur", 500, message);
    }
}

// ROUTE.TS
export async function POST(req: Request) {
    try {
        const fd = await req.formData();
        const username = fd.get("title")?.toString();
        const email = fd.get("email")?.toString();
        const password = fd.get("password")?.toString();
        const image = fd.get("avatar") as File || null;

        if(!username || !email || !password) return failure("Tous les champs sont requis");

        const imageUrl = image && image.size > 0
        ? `/uploads/${Date.now()}-${image.name.replace(/\s+/g, "_")}`
        : null;

        if(imageUrl && image)
            await writeFile(`public${imageUrl}`, Buffer.from(image.arrayBuffer()));

        const user = await addUser(username, email, image, password);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnu";
        return failure("Erreur serveur", 500, message);
    }
}

// ROUTE PROTEGER AVEC MIDDLEWARE

// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware(req) {
//     // custom logic if needed
//   },
//   {
//     callbacks: {
//         // Seulement autorisé si le token exist
//         authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = { 
//     // matcher: ["/articles/new", "/articles/:path*/edit"]
// };

// 

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/services/prisma";

// export async function getAuthenticatedUser() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) return null;

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email },
//   });

//   return user;
// }

// // ->

// const user = await getAuthenticatedUser();
// if (!user) return failure("Accès non autorisé", 401);





























///////////////////////////////////////////
import withAuth from "next-auth/middleware";

export default withAuth({
    callbacks: ({ token }) => !!token
});

export const config {
    [ "/article/create" ]
}