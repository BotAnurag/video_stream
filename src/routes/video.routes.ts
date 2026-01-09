import { Router, Request, Response } from "express";
import { uploads } from "../middleware/multer.middleware";
import {
  uploadVideo,
  getAllVideos,
  getSingleVideo,
} from "../controller/video.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllVideos);
router.post(
  "/",
  verifyToken,
  uploads.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadVideo
);

router.get("/:id", verifyToken, getSingleVideo);

export default router;
