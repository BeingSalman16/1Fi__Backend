import dns from "dns";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);
      server.close(() => process.exit(0));
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
