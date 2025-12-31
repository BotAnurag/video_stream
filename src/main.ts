import { AppDataSource } from "./config/typeorm.config";
import app from "./index";
import Redis from "ioredis";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

if (!Number(process.env.APP_PORT)) {
  console.log(` ⛔ error no port number provided`);
  process.exit(1);
}

AppDataSource.initialize()
  .then(() => {
    console.log("🛢️    Database connected");

    const server = app.listen(Number(process.env.APP_PORT!), () => {
      console.log(`🚀   server is running ${process.env.APP_PORT} `);
    });
    server.on("error", (error) => {
      console.log("🚀❌error", error);
      return error;
    });
  })
  .catch((error) => {
    console.error("🚨 error while connecting to database", error);
  });
