import { Router, Request, Response } from "express";
import { uploads } from "../utils/videoUpload.utils";
import { uploadVideo } from "../controller/video.controller";

const router = Router();

router.post("/", uploads.single("video"), uploadVideo);

export default router;
