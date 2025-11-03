import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/services/prisma";
import { createUser } from "@/controllers/userController";
import { success, failure } from "@/lib/apiResponse";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return failure("Tous les champs sont requis", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return failure("Email déjà utilisé", 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await createUser( username, email, hashedPassword );

    return success(user, 201);
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}