import dotenv from "dotenv";
import path from "path";

// Load environment variables before any other imports
// Use absolute path to ensure it works regardless of where the script is run from
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Verify critical env vars are loaded
if (!process.env.DB_PASSWORD) {
  console.error("❌ DB_PASSWORD not found in environment variables");
  console.log("Looking for .env at:", envPath);
  process.exit(1);
}

import { Worker } from "bullmq";
import { Redis } from "ioredis";
import processVideoToHLS from "../service/ffmpeg.service";
import { AppDataSource } from "../config/typeorm.config";
import { videoEntity } from "../entity/video.entity";
import { VideoStatus } from "../utils/enum.utils";

const connection = new Redis({
  maxRetriesPerRequest: null,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

AppDataSource.initialize()
  .then(() => console.log("✅ DB connected"))
  .catch((err) => {
    console.error("❌ DB connection error", err);
    console.error("DB_PASSWORD type:", typeof process.env.DB_PASSWORD);
    console.error(
      "DB_PASSWORD value:",
      process.env.DB_PASSWORD ? "***" : "undefined"
    );
  });

const videoRepo = AppDataSource.getRepository(videoEntity);
const worker = new Worker(
  "video-processing",
  async (job) => {
    const { filePath, videoId } = job.data;
    const ffmpegResponse = await processVideoToHLS(filePath);

    const find = await videoRepo.findOne({ where: { id: videoId } });

    await videoRepo.update(
      { id: videoId },
      {
        resolution: ffmpegResponse.variantPaths,
        status: VideoStatus.FINISHED,
      }
    );
  },
  {
    connection,
    concurrency: 2,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
