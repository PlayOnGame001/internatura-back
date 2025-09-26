import { buildApp } from "./app";
import type { Config } from "./config/schema";

const start = async () => {
  const app = await buildApp();

  const { PORT, HOST } = app.config as Config;

  await app.listen({ port: PORT, host: HOST });
  console.log(`Server started on http://${HOST}:${PORT}`);
  console.log(`Swagger: http://${HOST}:${PORT}/docs`);
};

void start();