import { PrismaClient } from "@prisma/client";

// typage de global pour attacher une instance PrismaClient et éviter les multiples connexion
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Si une instance n'existe pas on en créer une
const prisma = globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;