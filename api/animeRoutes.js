// api/animeRoutes.js
import connectDB from "../utils/connectDB.js";
import UserAnime from "../models/UserAnime.js";
import authMiddleware from "../middleware/auth.js";

connectDB();

export default async function handler(req, res) {
  // Run auth middleware
  const user = await authMiddleware(req, res);
  if (!user) return; // authMiddleware handles 401

  const { method } = req;
  const { id } = req.query; // for PUT/DELETE

  try {
    switch (method) {
      case "GET":
        const animeList = await UserAnime.find({ userId: user._id });
        res.status(200).json(animeList);
        break;

      case "POST":
        const anime = new UserAnime({ ...req.body, userId: user._id });
        await anime.save();
        res.status(201).json(anime);
        break;

      case "PUT":
        if (!id) return res.status(400).json({ error: "Anime ID is required" });
        const updatedAnime = await UserAnime.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAnime);
        break;

      case "DELETE":
        if (!id) return res.status(400).json({ error: "Anime ID is required" });
        await UserAnime.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
