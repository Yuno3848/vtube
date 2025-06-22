import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";
import { authMid } from "../middlewares/auth.middlewares.js";

const playlist = Router();

playlist.post("/create-playlist", authMid, createPlaylist);
playlist.get("/get-user-playlist/:userId", authMid, getUserPlaylists);
playlist.get("/get-playlist-byId/:playlistId", authMid, getPlaylistById);
playlist.patch(
  "/add-video-playlist/:playlistId/:videoId",
  authMid,
  addVideoToPlaylist
);
playlist.patch(
  "/remove-video-from-playlist/:playlistId/:videoId",
  authMid,
  removeVideoFromPlaylist
);

playlist.put("/delete-playlist/:playlistId", authMid, deletePlaylist);
playlist.patch("/update-playlist/:playlistId", authMid, updatePlaylist);

export default playlist;
