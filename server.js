// server.js
import express from "express";
import cors from "cors";
import connectDB from "./utils/connectDB.js";

// Import routers
import authRouter from "./api/auth.js";
import userAnimeRouter from "./api/userAnime.js";

// Connect to MongoDB
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/userAnime", userAnimeRouter);

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Anime Dashboard API is running</h1>");
});

// Export the app as Vercel serverless function
export default app;
