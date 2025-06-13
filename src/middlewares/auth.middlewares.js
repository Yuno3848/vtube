import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const authMid = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  console.log("token middleware", token);
  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      throw new ApiError(401, "Token verification failed");
    }

    req.user = decoded;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});
