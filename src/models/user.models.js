import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowcase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "",
        localPath: "",
      },
    },
    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "",
        localPath: "",
      },
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, name: this.username, email: this.email },
    process.env.SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.refereshGenerateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      fullName: this.fullName,
      email: this.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
export const User = mongoose.model("User", userSchema);
