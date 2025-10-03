const UserAnime = require("../models/UserAnime");

// Add anime to user's dashboard
exports.addAnime = async (req, res) => {
  try {
    const { animeId, title, poster, status } = req.body;

    // Check if anime already exists for this user
    const existing = await UserAnime.findOne({ userId: req.user._id, animeId });
    if (existing) {
      return res.status(400).json({ message: "Anime already in dashboard" });
    }

    const anime = new UserAnime({
      userId: req.user._id,
      animeId,
      title,
      poster,
      status,
    });

    await anime.save();
    res.status(201).json(anime);
    console.log("User making request:", req.user);
    console.log("Body received:", req.body);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update anime status
exports.updateAnime = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await UserAnime.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Anime not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete anime from dashboard
exports.deleteAnime = async (req, res) => {
  try {
    const deleted = await UserAnime.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Anime not found" });

    res.json({ message: "Anime deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all anime for a user
exports.getUserAnime = async (req, res) => {
  try {
    const userAnime = await UserAnime.find({ userId: req.user._id });
    res.json(userAnime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
