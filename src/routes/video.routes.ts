import { Router, Request, Response } from "express";
import { uploads } from "../middleware/multer.middleware";
import { uploadVideo, getVideos } from "../controller/video.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getVideos);
router.post("/", uploads.single("video"), uploadVideo);

export default router;
