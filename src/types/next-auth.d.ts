import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      avatar?: string | null;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string; // ✅ on ajoute le champ manquant
    };
  }
}