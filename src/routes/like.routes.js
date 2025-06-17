import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controllers.js";
import { authMid } from "../middlewares/auth.middlewares.js";

const like = Router();

like.post("/like-video/:videoId", authMid, toggleVideoLike);
like.post("/like-comment/:commentId", authMid, toggleCommentLike);
like.post("/toggle-tweet-like/:tweetId", authMid, toggleTweetLike);
like.get("/get-liked-videos", authMid, getLikedVideos);
export default like;
