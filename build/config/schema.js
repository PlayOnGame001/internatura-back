"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
exports.EnvSchema = {
    type: 'object',
    properties: {
        PORT: { type: 'number', default: 3000 },
        HOST: { type: 'string', default: '127.0.0.1' },
        DATABASE_URL: {
            type: 'string',
            default: 'mongodb://localhost:27017/feeddb?replicaSet=rs0'
        },
        DEFAULT_FEED_URL: {
            type: 'string',
            default: 'https://feeds.feedburner.com/oreilly/radar'
        },
        NODE_ENV: {
            type: 'string',
            enum: ['development', 'production', 'test'],
            default: 'development'
        }
    },
    required: ['PORT', 'HOST', 'DATABASE_URL'],
    additionalProperties: false,
};
