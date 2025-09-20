"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string", nullable: true },
                    url: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                },
                required: ["id", "url", "createdAt"],
            },
        },
        500: {
            type: "object",
            properties: {
                error: { type: "string" },
            },
            required: ["error"],
        },
    },
};
