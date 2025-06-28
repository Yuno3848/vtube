import { Router } from "express";
import { authMid } from "../middlewares/auth.middlewares.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controllers.js";
const comment = Router();
comment.post("/get-video-comments/:videoId", authMid, getVideoComments);
comment.post("/add-comment/:videoId", authMid, addComment);
comment.patch("/update-comment/:commentId", authMid, updateComment);
comment.delete("/delete-comment/:commentId", authMid, deleteComment);

export default comment;
