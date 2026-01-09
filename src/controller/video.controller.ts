import { Request, Response } from "express";
import path from "node:path";

import { AppDataSource } from "../config/typeorm.config";
import { videoEntity } from "../entity/video.entity";
import { CreateVideoDto } from "../dto/video.dto";
import { ApiError } from "../utils/apierror.utils";

import { VideoService } from "../service/video.service";
import { getVideoDuration } from "../service/videoDuration.service";
import { duration } from "zod/v4/classic/iso.cjs";
import asyncHandler from "express-async-handler";
import { validate as isUuid } from "uuid";
const videoService = new VideoService();

const videoRepo = AppDataSource.getRepository(videoEntity);

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const uploadFile = req.files as {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    };

    if (!uploadFile?.image || !uploadFile?.video)
      throw new ApiError(404, "image  or video not found");
    const request = CreateVideoDto.safeParse(req.body);

    if (!request.success) {
      console.log(request.error);
      throw request.error;
    }

    const file = uploadFile.video[0]?.path;

    const extension = path.extname(file);
    const pathName = path.parse(file).name;

    const getTime = await getVideoDuration(file);

    const formatDuration = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);

      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    };
    const standardTIme = formatDuration(getTime);

    const createVideo = videoRepo.create({
      name: request.data.name,
      video: pathName,
      thumbnail: `uploads/${uploadFile.image[0].filename}`,
      originalVideo: `uploads/${pathName}${extension}`,
      masterPlaylist: `video/${pathName}/playlist.m3u8P`,
      duration: standardTIme,
    });

    const saveVideo = await videoRepo.save(createVideo);

    const thumbnail = `${process.env.BACKEND_URL}/${saveVideo.thumbnail}`;

    await videoService.enqueueVideo(file, saveVideo.id);

    res.status(200).json({
      thumbnail,
      status: saveVideo.status,
      message: "video will be updated soon and you will get notified",
      duration: standardTIme,
    });

    // const createVideo = await videoRepo.create({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "fail while uploading the video", error });
  }
  3;
};

export const getAllVideos = asyncHandler(
  async (req: Request, res: Response) => {
    // const userQuality = req.user?.quality;
    const getVideo = await videoRepo.find();

    const url = getVideo.map((item) => ({
      id: item.id,
      video: `http://localhost:3000/uploads${item.thumbnail}`,
      name: item.name,
    }));

    res.send({ url });
  }
);

export const getSingleVideo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!isUuid(req.params.id)) throw new ApiError(400, "invalid id");

    const getVideo = await videoRepo.findOneOrFail({
      where: { id: req.params.id },
    });
    const masterPlaylist = `${process.env.BACKEND_URL}/${getVideo.masterPlaylist}`;

    const response = {
      name: getVideo.name,
      playList: masterPlaylist,
    };

    res.status(200).json({ response });
  }
);
