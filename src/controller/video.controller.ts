import { Request, Response } from "express";
import path from "node:path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { AppDataSource } from "../config/typeorm.config";
import { videoEntity } from "../entity/video.entity";
import { CreateVideoDto } from "../dto/video.dto";

const videoRepo = AppDataSource.getRepository(videoEntity);

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    // const request = CreateVideoDto.safeParse(req.body);

    // if (!request.success) {
    //   console.log(request.error);
    //   throw request.error;
    // }
    if (!req.file)
      return res
        .status(404)
        .json({ message: { status: 404, message: "image not found" } });

    // const createVideo = await videoRepo.create({});

    const file = req.file;
    const chunkDir = path.join(
      __dirname,
      "../../video",
      path.parse(req.file.path).name
    );

    const pathName = path.parse(req.file.path).name;

    if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir, { recursive: true });
    ffmpeg(file.path)
      .outputOptions([
        "-preset veryfast",
        "-g 48",
        "-sc_threshold 0",
        "-map 0:v:0",
        "-map 0:a:0?",
        "-c:v libx264",
        "-profile:v main",
        "-crf 20",
        "-c:a aac",
        "-ar 48000",
        "-hls_time 10",
        "-hls_list_size 0",
        "-hls_flags independent_segments",
        "-start_number 0",
      ])
      .output(path.join(chunkDir, "playlist.m3u8"))
      .on("end", () => {
        console.log("video processing done");
        res.status(200).json({
          message: "video uploaded successfully",
          url: `http://localhost:3000/video/${pathName}/playlist.m3u8`,
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        res.status(500).json({
          message: "fail while uploading video",
        });
      })
      .run();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "fail while uploading the video", error });
  }
};

export const getVideos = async (req: Request, res: Response) => {};
