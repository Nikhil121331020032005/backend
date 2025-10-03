// api/userAnime.js
import connectDB from "../utils/connectDB.js";
import UserAnime from "../models/UserAnime.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

connectDB();

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    const { method } = req;
    const { id } = req.query;

    switch (method) {
      case "GET":
        const animeList = await UserAnime.find({ userId: user._id });
        return res.status(200).json(animeList);

      case "POST":
        const anime = new UserAnime({ ...req.body, userId: user._id });
        await anime.save();
        return res.status(201).json(anime);

      case "PUT":
        const updated = await UserAnime.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updated);

      case "DELETE":
        await UserAnime.findByIdAndDelete(id);
        return res.status(200).json({ message: "Deleted" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


