import './telemetria/info';
import { buildApp } from "./app";
import { initializeFeeds } from "./modules/feedParser/services/feedInitService";

const start = async () => {
  const app = await buildApp();

  const { PORT, HOST } = app.config; 

  try {
    await initializeFeeds();
  } catch (error) {
    app.log.error('Failed to initialize feeds, but continuing server start:', error);
  }

  await app.listen({ port: PORT, host: HOST });
  console.log(`Server started on http://127.0.0.1:${PORT}`);
  console.log(`Swagger: http://127.0.0.1:${PORT}/docs`);
};

void start();