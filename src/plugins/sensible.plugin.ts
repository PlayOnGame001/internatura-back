import fp from "fastify-plugin";
import sensible from "@fastify/sensible";
import { FastifyReply } from "fastify";

export default fp(async (fastify) => {
  await fastify.register(sensible);
  fastify.decorateReply('noContent', function (this: FastifyReply) {
    this.code(204);
    return this.send();
  })
}, {
  name: "sensible-plugin",
});

