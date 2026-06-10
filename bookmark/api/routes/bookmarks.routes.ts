import express from "express";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getPublicProfile,
} from "../controllers/bookmarks.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Protected Routes
router.get("/", authMiddleware, getBookmarks);
router.post("/", authMiddleware, createBookmark);
router.put("/:id", authMiddleware, updateBookmark);
router.delete("/:id", authMiddleware, deleteBookmark);

// Public Profile Route
router.get("/profile/:handle", getPublicProfile);

export default router;