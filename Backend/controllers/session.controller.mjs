import Session from "../models/Session.mjs";

// Create Session
export const createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Session
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Sessions by Expo
export const getSessionsByExpo = async (req, res) => {
  try {
    const sessions = await Session.find({ expoId: req.params.expoId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
