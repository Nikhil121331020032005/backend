// api/auth.js
import connectDB from "../utils/connectDB.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      if (req.url.includes("/register")) {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User exists" });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashed });
        return res.status(201).json(newUser);
      }

      if (req.url.includes("/login")) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY, {
          expiresIn: "1d",
        });
        return res.status(200).json({ token, user });
      }
    }

    if (method === "GET" && req.url.includes("/user")) {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ msg: "No token" });

      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded.id).select("-password");
      return res.status(200).json(user);
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


