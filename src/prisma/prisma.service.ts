import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB() {
  await prisma.$connect();
}

export default prisma;
