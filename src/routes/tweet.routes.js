import { Router } from "express";
import { authMid } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  deleteTweetById,
  getUserTweetsById,
  updateTweetById,
} from "../controllers/tweet.controllers.js";

const tweet = Router();
tweet.post("/create-tweet", authMid, createTweet);
tweet.get("/get-tweet-by-id/:userId", authMid, getUserTweetsById);
tweet.patch("/update-tweet-by-id/:tweetId", updateTweetById);
tweet.put("/delete-tweet-by-id/:tweetId", authMid, deleteTweetById);
export default tweet;
