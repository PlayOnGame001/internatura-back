import {FromSchema} from "json-schema-to-ts";

export const EnvSchema = {
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
} as const;

export type Config = FromSchema<typeof EnvSchema>;