import { buildApp } from "./app";

const start = async () => {
  const app = await buildApp();
  await app.listen({ port: 3000, host: "0.0.0.0" });
  console.log("Swagger UI: http://localhost:3000/docs");
};

void start();
