import { hash } from "bcrypt";
import { success, failure } from "@/lib/apiResponse";
import prisma from "../services/prisma";

const defaultAvatar = process.env.USER_DEFAULT ?? "/uploads/user-default.jpg";

export async function createUser(
  username: string, 
  email: string, 
  password: string,
  avatar: string | null
): Promise<Response> {
  try {
  console.log('Mot de passe reçu à l\'inscription:', password);
  console.log('Longueur du mot de passe reçu à l\'inscription:', password.length);
    // const hashedPassword = await hash(password, 10);
    // console.log('Hash généré à l\'inscription:', hashedPassword);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        avatar: defaultAvatar
      },
    });

    return success(user, 201);
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnu";
    return failure("Erreur serveur", 500, message);
  }
}