import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to DB via Prisma');
  } catch (err) {
    console.error('❌ Error connecting to database', err);
    process.exit(1);
  }
}

export default prisma;
