import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
    // Déconnecte l'utilisateur côté NextAuth
    const session = await getServerSession(authOptions);
    if (session) {
        // NextAuth gère la suppression du cookie côté client
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false });
}
