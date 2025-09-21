import Fastify from "fastify";
import autoload from "@fastify/autoload";
import path from "path";

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(autoload, {
      dir: path.join(process.cwd(), "src/plugins"),
    });

    await fastify.register(autoload, {
      dir: path.join(process.cwd(), "src/modules"),
      options: { prefix: "/api" },
    });

    fastify.get("/health", async () => ({ status: "ok" }));

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running at http://localhost:3000");
    console.log("Swagger UI available at http://localhost:3000/docs");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
