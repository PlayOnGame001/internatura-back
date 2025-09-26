import { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "../services/userService";
import { registerSchema, loginSchema } from "../schemas/userData.schema";

export async function userRout(fastify: FastifyInstance) {
  fastify.post("/register", { schema: registerSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    try {
      const user = await registerUser(email, password);
      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    try {
      const token = await loginUser(email, password);
      return reply.send({ token });
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });
}
