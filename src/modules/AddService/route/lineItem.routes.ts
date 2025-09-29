import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { renderForm, handleCreate, getAllItems } from '../types/lineItem.type';

async function lineItemRoutes(fastify: FastifyInstance) {
  fastify.log.info('✅ lineItemRoutes plugin is registering');

  fastify.get('/form', renderForm);
  fastify.post('/', handleCreate);
  fastify.get('/all', getAllItems);
}

export default fp(lineItemRoutes);
