import { upload } from "../middlewares/multer.middlewares.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiReponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Invalid fields");
  }

  const isUserExisted = await User.findOne({ $or: [{ username }, { email }] });
  if (isUserExisted) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req?.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;
  console.log("---------------------------------");
  console.log("avatar :", avatar);
  console.log("---------------------------------");

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: { url: avatar.url, localPath: req?.files?.avatar[0]?.path },
    coverImage: {
      url: coverImage.url,
      localPath: req?.files?.coverImage[0]?.path,
    },
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User not found!");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.refereshGenerateAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ $or: [{ email }, { password }] });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordMatched(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(400, "login failed");
  }

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "user login successfully",
        loggedInUser,
        accessToken,
        refreshToken
      )
    );
});

export const refToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token is missing");
  }

  //decode the jwt token from cookie
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.SECRET_KEY
    );

    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(401, "user not found");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid token ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, "refresh token generated successfully", user));
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

export const logout = asyncHandler(async (req, res) => {
  //write middleware for it
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  console.log("logout user line no. 175 :", user);
  //clear cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accesToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logout successfully"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new ApiError(401, "user not found");
  }

  const isPasswordCorrect = user.isPasswordMatched(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, "password changed successfully", {
      username: user.username,
      email: user.email,
    })
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  return res.status(200).json(new ApiResponse(200, "user found", user));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set: { username, email },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "account updated successfully", user));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar not found");
  }

  const avatarImage = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar image", avatarImage);
  if (!avatarImage) {
    throw new ApiError(500, "failed to upload avatar on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { "avatar.url": avatarImage?.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "avatar updated successfully", user));
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "avatar not found");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("avatar image", coverImage);
  if (!coverImage) {
    throw new ApiError(500, "failed to upload avatar on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { "coverImage.url": coverImage?.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "coverImage updated successfully", user));
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  console.log("req user id :", req.user.id);
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "username is required");
  }
  const channel = User.aggregate([
    { $match: { username: username?.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribedTo: {
          $cond: {
            if: { $in: [req.user?.id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribedTo: 1,
        avatar: 1,
        converImage: 1,
        email: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "channel found", channel[0]));
});

export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0]?.watchHistory || [],
        "watch history fetched successfully"
      )
    );
});
