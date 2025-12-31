import { Router, Request, Response } from "express";
import { uploads } from "../middleware/multer.middleware";
import { uploadVideo, getVideos } from "../controller/video.controller";

const router = Router();

router.get("/", getVideos);
router.post("/", uploads.single("video"), uploadVideo);

export default router;
