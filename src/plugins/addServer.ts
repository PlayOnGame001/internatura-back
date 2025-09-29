import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import lineItemRoutes from '../modules/AddService/route/lineItem.routes';

export default fp(async function (fastify: FastifyInstance) {
  // Регистрируем multipart
  await fastify.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 }
  });

  // Регистрируем роуты line-item через плагин
  fastify.log.info('🔥 addservice plugin is registering');
  await fastify.register(lineItemRoutes, { prefix: '/line-item' });
});
