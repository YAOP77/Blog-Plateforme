import { NextResponse } from "next/server";
import prisma from "@/services/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true
            }
        });
        if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        return NextResponse.json({ data: user });
    } catch (e) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
