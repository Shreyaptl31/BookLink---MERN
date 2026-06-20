import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import bookmarkRoutes from "./routes/bookmarks.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("BookLink API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});