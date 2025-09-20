"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to DB via Prisma');
    }
    catch (err) {
        console.error('❌ Error connecting to database', err);
        process.exit(1);
    }
}
exports.default = prisma;
