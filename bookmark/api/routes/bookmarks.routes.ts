import express from "express";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "../controllers/bookmarks.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createBookmark);
router.get("/", authMiddleware, getBookmarks);
router.put("/:id", authMiddleware, updateBookmark);
router.delete("/:id", authMiddleware, deleteBookmark);

export default router;