import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookmarkRoutes from "./routes/bookmarks.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("BookLink API running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});