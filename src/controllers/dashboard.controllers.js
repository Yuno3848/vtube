import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";

export const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const channelDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(User.req?.id),
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "owner",
        localField: "_id",
        as: "allVideos",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              foreignField: "video",
              localField: "_id",
              as: "likes",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subscription",
        foreignField: "channel",
        localField: "_id",
      },
    },
  ]);
});

export const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({
    owner: req.user?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Channel videos fetched successfully", videos));
});
