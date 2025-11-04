import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/services/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        
        // Upload vers Cloudinary si un avatar est fourni
        if (avatarFile && avatarFile.size > 0) {
            try {
                // Convertir le File en Buffer
                const bytes = await avatarFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Upload vers Cloudinary
                const result = await new Promise<{secure_url: string}>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "blog-avatars",
                            resource_type: "image",
                            transformation: [
                                { width: 400, height: 400, crop: "fill", gravity: "face" }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result as {secure_url: string});
                        }
                    ).end(buffer);
                });

                avatarUrl = result.secure_url;
            } catch (error) {
                console.error("Erreur upload Cloudinary:", error);
                return NextResponse.json({ 
                    message: "Erreur lors de l'upload de l'avatar" 
                }, { status: 500 });
            }
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
