import { FastifyInstance } from 'fastify';
import { renderForm, handleCreate, getAllItems } from '../types/lineItem.type';

export async function lineItemRoutes(fastify: FastifyInstance) {
  fastify.log.info('✅ lineItemRoutes plugin is registering');

  fastify.get('/form', renderForm);
  fastify.post('/', handleCreate);
  fastify.get('/all', getAllItems);
}

