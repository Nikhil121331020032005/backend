const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Remove Bearer prefix
    const jwtToken = token.replace("Bearer ", "").trim();

    // Verify token
    const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY);

    // Find user
    const userData = await User.findOne({ email: isVerified.email }).select("-password");

    if (!userData) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach user to request
    req.user = userData;
    req.token = jwtToken;
    req.userID = userData._id;

    next();
  } catch (error) {
    console.log(`Authentication error: ${error}`);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
