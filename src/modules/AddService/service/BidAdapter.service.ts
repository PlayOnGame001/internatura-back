import { FastifyInstance } from 'fastify';
import { LineItem } from '../types/BidAdapter.Interface';

export async function getAllLineItems(fastify: FastifyInstance): Promise<LineItem[]> {
  return fastify.prisma.lineItem.findMany();
}
