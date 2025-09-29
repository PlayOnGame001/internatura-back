import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BidRequest, LineItem } from '../types/BidAdapter.Interface';
import { getAllLineItems } from '../service/BidAdapter.service';

export async function bidAdapterRoutes(fastify: FastifyInstance) {
  fastify.log.info('✅ bidAdapterRoutes plugin is registering');

  fastify.post<{ Body: BidRequest }>(
    '/bid',
    async (
      req: FastifyRequest<{ Body: BidRequest }>,
      reply: FastifyReply
    ) => {
      const { size, geo, cpm } = req.body;

      // Получаем все объекты
      const lineItems = await getAllLineItems(fastify);

      const filtered = lineItems.filter((item: LineItem) => {
        if (item.size !== size) return false;
        if (geo && item.geo && item.geo !== geo) return false;
        if (cpm < item.minCpm || cpm > item.maxCpm) return false;
        return true;
      });

      if (filtered.length === 0) {
        return reply.code(204).send();
      }

      const selected = filtered[0];

      return reply.send({
        id: selected.id,
        size: selected.size,
        adType: selected.adType,
        creativeUrl: selected.creativeUrl,
      });
    }
  );
}
