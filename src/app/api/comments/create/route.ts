import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/services/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const body = await request.json();
    const { articleId, text } = body;
    if (!articleId || !text) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
    const comment = await prisma.comment.create({
      data: {
        description: text,
        articleId,
        userId: user.id,
      },
      include: {
        user: { select: { username: true, avatar: true } }
      }
    });
    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: "Erreur serveur", details: message }, { status: 500 });
  }
}
