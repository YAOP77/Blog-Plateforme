import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/services/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
        }
        const fd = await req.formData();
        const username = fd.get("username")?.toString();
        const avatarFile = fd.get("avatar") as File | null;
        let avatarUrl: string | undefined = undefined;
        
        // Upload vers Vercel Blob si un avatar est fourni
        if (avatarFile && avatarFile.size > 0) {
            const blob = await put(avatarFile.name, avatarFile, {
                access: 'public',
                addRandomSuffix: true,
            });
            avatarUrl = blob.url;
        }
        
        const updateData: { username?: string; avatar?: string } = {};
        if (username) updateData.username = username;
        if (avatarUrl) updateData.avatar = avatarUrl;
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json({ message: "Erreur serveur", details: message }, { status: 500 });
    }
}
