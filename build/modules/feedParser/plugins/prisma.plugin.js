"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const pluginName = "prisma-plugin";
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    try {
        const prisma = new client_1.PrismaClient({
            log: ["query", "info", "warn", "error"],
        });
        await prisma.$connect();
        fastify.decorate("prisma", prisma);
        fastify.addHook("onClose", async (instance) => {
            await instance.prisma.$disconnect();
        });
        fastify.pluginLoaded(pluginName);
    }
    catch (error) {
        fastify.log.error("❌ Error connecting to Prisma:", error);
        throw error;
    }
}, {
    name: pluginName,
});
