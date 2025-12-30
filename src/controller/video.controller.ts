import { Request, Response } from "express";
import path from "node:path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res
        .status(404)
        .json({ message: { status: 404, message: "image not found" } });
    console.log();

    const file = req.file;
    const chunkDir = path.join(
      __dirname,
      "../video",
      path.parse(req.file.path).name
    );
    console.log("i am here ");

    if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir, { recursive: true });
    ffmpeg(file.path)
      .outputOption([
        "-codec copy",
        "-hls_time 300",
        "-hls_list_size 0",
        "-start_number 0",
      ])
      .output(path.join(chunkDir, "playlist.m3u8"))
      .on("end", () => {
        console.log("video processing done");
        res.status(200).json({ message: "video uploaded success fully" });
      })
      .on("error", (err) => {
        console.log(err);
        res.status(500).json({ message: "fail while uploading video" });
      })
      .run();
  } catch (error) {}
};

export const getVideos = async (req: Request, res: Response) => {
  const getVideo = path.join(__dirname, "../video/playlist.m3u8");
  res;
};
