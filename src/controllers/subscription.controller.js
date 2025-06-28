import mongoose, { isValidObjectId } from "mongoose";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiReponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId) || !channelId) {
    throw new ApiError(400, "Invalid channel id...");
  }

  const existingSubscription = await Subscription.findById(channelId);
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(channelId);
    return res
      .status(204)
      .json(
        new ApiResponse(204, "subscription status status toggled successfully")
      );
  }

  const toggleSubscription = await Subscription.create({
    subscriber: req.user?.id,
    channel: channelId,
  });

  if (!toggleSubscription) {
    throw new ApiError(500, "Error while toggle subscription...");
  }

  return res
    .status(201)
    .json(
      201,
      "Subscription status toggled successfully...",
      toggleSubscription
    );
});

const getUserChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId) || !channelId) {
    throw new ApiError(400, "Invalid channel id...");
  }

  const subscribers = await Subscriber.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $count: "subscriberCount",
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Subscribers fetched successfully...", subscribers)
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id...");
  }

  const subscribed = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $count: "subscribed ",
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Subscriber to channels fetched successfully...",
        subscribed
      )
    );
});

export { toggleSubscription, getUserChannelSubscriber, getSubscribedChannels };
