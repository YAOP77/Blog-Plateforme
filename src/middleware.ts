import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/profile",
  "/articles/create",
  "/articles/edit",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Vérifie si la route est protégée
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ req });
    if (!token) {
      // Redirige vers la page de connexion si non connecté
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/articles/create", "/articles/edit/:path*"]
};
