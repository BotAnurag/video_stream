import { Request, Response } from "express";
import path from "node:path";
import fs from "fs";

import { AppDataSource } from "../config/typeorm.config";
import { videoEntity } from "../entity/video.entity";
import { CreateVideoDto } from "../dto/video.dto";
import { videoQueue } from "../queue/video.queue";
import { VideoService } from "../service/video.service";
const videoService = new VideoService();

const videoRepo = AppDataSource.getRepository(videoEntity);

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res
        .status(404)
        .json({ message: { status: 404, message: "image not found" } });

    const request = CreateVideoDto.safeParse(req.body);

    if (!request.success) {
      console.log(request.error);
      throw request.error;
    }

    const file = req.file?.path;
    const extension = path.extname(file);
    const pathName = path.parse(file).name;

    const createVideo = videoRepo.create({
      name: request.data.name,
      video: pathName,
      originalVideo: `uploads/${pathName}${extension}`,
      masterPlaylist: `video/${pathName}/playlist.m3u8P`,
    });

    const saveVideo = await videoRepo.save(createVideo);
    await videoService.enqueueVideo(file, saveVideo.id);

    res.status(200).json({
      message:
        "video added to the queue you will receive notification when complete",
    });

    // const createVideo = await videoRepo.create({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "fail while uploading the video", error });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  const getVideo = await videoRepo.find();
  const url = getVideo.map((item) => ({
    ...item,
    video: `http://localhost:3000/video/${item.video}/playlist.m3u8`,
  }));

  res.send({ url, getVideo });
};

const updateVideo = async (req: Request, res: Response) => {};
