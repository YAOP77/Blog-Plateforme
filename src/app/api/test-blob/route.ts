import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Vérifier si le token Blob est présent
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
        
        return NextResponse.json({
            success: true,
            blobTokenPresent: !!blobToken,
            blobTokenLength: blobToken ? blobToken.length : 0,
            blobTokenPrefix: blobToken ? blobToken.substring(0, 20) + "..." : "N/A",
            env: process.env.NODE_ENV,
            message: blobToken 
                ? "✅ BLOB_READ_WRITE_TOKEN est configuré" 
                : "❌ BLOB_READ_WRITE_TOKEN est MANQUANT"
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        }, { status: 500 });
    }
}

