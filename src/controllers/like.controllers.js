import mongoose, { isValidObjectId } from "mongoose";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiReponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;
  //TODO: toggle like on video
  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video id...");
  }
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "video unliked...", existingLike));
  }
  const newLike = await Like.create({
    video: videoId,
    likedBy: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "video liked successfully...", newLike));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  //TODO: toggle like on comment
  if (!commentId || mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "Invalid comment id...");
  }

  const commentVideo = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (commentVideo) {
    Like.findByIdAndDelete(commentVideo._id);
    throw new ApiResponse(200, "comment unliked successfully");
  }
  const newLike = await Like.create({
    comment: commentId,
    likedBy: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "comment liked successfully", newLike));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user.id;
  //TODO: toggle like on tweet
  if (!tweetId || mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(404, "Invalid tweet id...");
  }

  const tweetToggleVideo = await Like.findByOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (tweetToggleVideo) {
    throw new ApiResponse(400, "tweet unliked successfully...");
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
  }
  return res.status(200).json(new ApiResponse(200, "tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user.id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $project: {
        _id: 0,
        video: "$likedVideos",
      },
    },
  ]);
  throw new ApiResponse(200, "liked videos", likedVideos);
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
