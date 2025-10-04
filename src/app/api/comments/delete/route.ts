import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/services/prisma";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.id !== comment.userId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur", details: error?.message }, { status: 500 });
  }
}
