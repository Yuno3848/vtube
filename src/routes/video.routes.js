import { Router } from "express";
import {
  deleteVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { authMid } from "../middlewares/auth.middlewares.js";

const video = Router();
console.log("Inside router");
video.post("/upload-video", upload.single("video"), authMid, publishAVideo);
video.post("/get-video-by-id/:videoId", authMid, getVideoById);
video.patch("/update-video/:videoId", authMid, updateVideo);
video.put("/delete-video/:videoId", authMid, deleteVideo);
video.post("/toggle-publish-status/:videoId", authMid, togglePublishStatus);
export default video;
