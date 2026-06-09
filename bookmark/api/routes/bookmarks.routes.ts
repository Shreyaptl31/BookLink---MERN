import express from "express";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "../controllers/bookmarks.controller";

const router = express.Router();

router.get("/", getBookmarks);
router.post("/", createBookmark);
router.put("/:id", updateBookmark);
router.delete("/:id", deleteBookmark);

export default router;