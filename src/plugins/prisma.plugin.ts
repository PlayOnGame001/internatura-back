import fp from 'fastify-plugin';
import prisma, { connectDB } from '../prisma/prisma.service';

export default fp(async (fastify) => {
  await connectDB();
  fastify.decorate('prisma', prisma);
  fastify.decorate('pluginLoaded', (pluginName: string) => {
    fastify.log.info(`Plugin loaded: ${pluginName}`);
  });
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
  fastify.pluginLoaded('prisma.plugin');
});
