"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const path_1 = __importDefault(require("path"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify = (0, fastify_1.default)({ logger: true });
const start = async () => {
    try {
        await fastify.register(swagger_1.default, {
            openapi: {
                info: {
                    title: 'RSS Feed API',
                    version: '1.0.0',
                    description: 'API для работы с RSS лентами',
                },
                servers: [{ url: 'http://localhost:3000' }],
            },
        });
        await fastify.register(swagger_ui_1.default, {
            routePrefix: '/docs',
            uiConfig: { docExpansion: 'list', deepLinking: false },
            initOAuth: {},
        });
        await fastify.register(autoload_1.default, {
            dir: path_1.default.join(process.cwd(), 'src/modules'),
            options: { prefix: '/api' },
        });
        fastify.get('/health', async () => ({ status: 'ok' }));
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running at http://localhost:3000');
        console.log('Swagger UI available at http://localhost:3000/docs');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
