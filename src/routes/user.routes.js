import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  login,
  logout,
  refToken,
  register,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  currentPasswordValidator,
  loginValidator,
  userRegValidator,
} from "../validator/validator.js";
import { validatorError } from "../middlewares/validator.middlewares.js";
import { authMid } from "../middlewares/auth.middlewares.js";

const auth = Router();

auth.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegValidator(),
  validatorError,
  register
);

auth.post("/login", loginValidator(), validatorError, login);
auth.get("/reftoken", authMid, refToken);
auth.patch("/logout", authMid, logout);
auth.patch(
  "/change-password",
  currentPasswordValidator(),
  validatorError,
  authMid,
  changeCurrentPassword
);
auth.get("/current-user-details", authMid, getCurrentUser);
auth.patch(
  "/update-account-details",

  authMid,
  updateAccountDetails
);

auth.patch(
  "/update-avatar",
  authMid,
  upload.single("avatar"),
  updateUserAvatar
);

auth.patch(
  "/cover-image",
  authMid,
  upload.single("coverImage"),
  updateUserCoverImage
);

auth.get("/c/:username", authMid, getUserChannelProfile);
auth.get("/history", authMid, getWatchHistory);
export default auth;
