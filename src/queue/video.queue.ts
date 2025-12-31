import { Redis } from "ioredis";
import { Queue } from "bullmq";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
export const videoQueue = new Queue("video-processing", {
  connection,
});
