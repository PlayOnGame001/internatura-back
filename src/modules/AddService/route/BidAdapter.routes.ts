import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BidRequest, LineItem } from '../types/BidAdapter.Interface';
import { getAllLineItems } from '../service/BidAdapter.service';
import { bidRequestSchema } from '../schemas/BidAdapter.schema';

export async function bidAdapterRoutes(fastify: FastifyInstance) {
  fastify.log.info('✅ bidAdapterRoutes plugin is registering');

  fastify.post<{ Body: BidRequest }>(
    '/bid',
    { schema: bidRequestSchema },
    async (
      req: FastifyRequest<{ Body: BidRequest }>,
      reply: FastifyReply
    ) => {
      const { size, geo, cpm } = req.body;

      const lineItems = await getAllLineItems(fastify);

      const filtered = lineItems.filter(({size: itemSize, geo: itemGeo, maxCpm, minCpm}: LineItem) => {
        if (size !== itemSize) return false;
        if (geo !== itemGeo) return false;
        if (cpm < minCpm || cpm > maxCpm) return false;
        return true;
      });

      if (filtered.length === 0) {
        return reply.noContent();
      }

      const {id, size: adSize, adType, creativeUrl} = filtered[0];

      return reply.send({
        id: id,
        size: adSize,
        adType: adType,
        creativeUrl: creativeUrl,
      });
    }
  );
}
