import { FastifyInstance } from 'fastify';
import { renderForm, handleCreate, getAllItems } from '../types/lineItem.type';
import { getAllLineItemsSchema, lineItemFormSchema, renderFormSchema } from '../schemas/lineitem.schema';

export async function lineItemRoutes(fastify: FastifyInstance) {
  fastify.log.info('✅ lineItemRoutes plugin is registering');

  fastify.get('/form', { schema: renderFormSchema }, renderForm);
  fastify.post('/', { schema: lineItemFormSchema }, handleCreate);
  fastify.get('/all', { schema: getAllLineItemsSchema }, getAllItems);
}

