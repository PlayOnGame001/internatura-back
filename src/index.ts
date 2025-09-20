import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { schema as feedSchema } from './modules/feedParser/schemas/getFeedData.schema';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(swagger, {
      openapi: {
        info: { title: 'RSS Feed API', version: '1.0.0' },
        servers: [{ url: 'http://localhost:3000' }],
      },
    });

    await fastify.register(swaggerUI, {
      routePrefix: '/docs',
      uiConfig: { docExpansion: 'list', deepLinking: false },
    });

    await fastify.register(autoload, {
      dir: path.join(process.cwd(), 'src/modules'),
      options: { prefix: '/api' },
    });

    fastify.get('/feed', { schema: feedSchema }, async () => {
      return [
        {
          id: '1',
          title: 'Пример RSS',
          url: 'https://example.com/rss',
          createdAt: new Date().toISOString(),
        },
      ];
    });

    fastify.get('/health', async () => ({ status: 'ok' }));

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
    console.log('Swagger UI available at http://localhost:3000/docs');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
