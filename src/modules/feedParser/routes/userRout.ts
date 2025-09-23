import { FastifyInstance } from "fastify";
import { createUser, findUserByEmail } from "../services/userService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/userData.schema";

export async function userRout(fastify: FastifyInstance) {
  fastify.post("/register", { schema: registerSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    const existing = await findUserByEmail(email);
    if (existing) return reply.status(400).send({ error: "User already exists" });

    const user = await createUser(email, password);
    return reply.status(201).send({ id: user.id, email: user.email });
  });

  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await findUserByEmail(email);
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.status(401).send({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    return reply.send({ token });
  });
}
