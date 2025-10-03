import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 }
  });

  fastify.log.info('🔥 addservice plugin is registering');
});
