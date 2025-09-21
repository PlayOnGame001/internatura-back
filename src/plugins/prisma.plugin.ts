import fp from 'fastify-plugin';
import prisma, { connectDB } from '../prisma/prisma.service';

export default fp(async (fastify) => {
  try {
    await connectDB();
    fastify.log.info('✅ Connected to DB via Prisma');
  } catch (err) {
    fastify.log.error('❌ Error connecting to database', err);
    process.exit(1);
  }
  fastify.decorate('prisma', prisma);
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
