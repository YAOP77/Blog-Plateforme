import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      avatar?: string | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}