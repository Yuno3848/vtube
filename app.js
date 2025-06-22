import express from "express";
import cookieParser from "cookie-parser";

import auth from "./src/routes/user.routes.js";
import video from "./src/routes/video.routes.js";
import tweet from "./src/routes/tweet.routes.js";
import like from "./src/routes/like.routes.js";
import comment from "./src/routes/comment.routes.js";
import playlist from "./src/routes/playlist.routes.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", auth);
app.use("/api/v1/video", video);
app.use("/api/v1/tweet", tweet);
app.use("/api/v1/like", like);
app.use("/api/v1/comment", comment);
app.use("/api/v1/playlist", playlist);
export default app;
