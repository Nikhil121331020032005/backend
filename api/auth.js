// api/auth.js
import connectDB from "../utils/connectDB.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validate from "../middleware/validate.js";
import signupSchema from "../validator/auth.js";

connectDB();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        if (req.url === "/register") {
          // Validation middleware
          const error = validate(signupSchema, req.body);
          if (error) return res.status(400).json({ error });

          const { username, email, password } = req.body;
          const existing = await User.findOne({ email });
          if (existing) return res.status(400).json({ error: "User exists" });

          const hashed = await bcrypt.hash(password, 10);
          const newUser = await User.create({ username, email, password: hashed });
          res.status(201).json(newUser);
        } else if (req.url === "/login") {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ error: "Invalid credentials" });

          const match = await bcrypt.compare(password, user.password);
          if (!match) return res.status(400).json({ error: "Invalid credentials" });

          const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
          res.status(200).json({ token, user });
        }
        break;

      case "GET":
        if (req.url === "/user") {
          const user = await authMiddleware(req, res);
          if (!user) return;
          res.status(200).json(user);
        }
        break;

      default:
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

