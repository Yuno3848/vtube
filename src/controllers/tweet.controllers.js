import mongoose, { isValidObjectId } from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiReponse.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  if (!content.trim()) {
    throw new ApiError(400, "Content field is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "tweet created successfully...", tweet));
});

// Fetch all tweets of a specific user
const getUserTweetsById = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(404, "User not found...");
  }

  const tweet = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tweetsDetails",
      },
    },
    {
      $unwind: "$tweetsDetails",
    },
    {
      $project: {
        username: "$tweetsDetails.username",
        createdAt: 1,
        updatedAt: 1,

        content: 1,
      },
    },
  ]);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found...");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "tweets fetched successfully", tweet));
});

// Update a tweet's content
const updateTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content.trim()) {
    throw new ApiError(400, "Content field is required");
  }
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "updated tweet successfully...", tweet));
});

// Delete a tweet by ID
const deleteTweetById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { tweetId } = req.params;

  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    throw new ApiError(
      404,
      "Oops! We couldn't find the tweet you're looking for..."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "tweet deleted successfully...", {}));
});

export { createTweet, getUserTweetsById, updateTweetById, deleteTweetById };
