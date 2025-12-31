import Registration from "../models/Registration.mjs";
import Session from "../models/Session.mjs";

// Register for Expo
export const registerExpo = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const { expoId } = req.body;
    const existing = await Registration.findOne({ userId: req.user._id, expoId });
    if (existing) return res.status(400).json({ message: "Already registered" });

    const registration = await Registration.create({ userId: req.user._id, expoId });
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register for Session
export const registerSession = async (req, res) => {
  try {
    const { expoId, sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const existing = await Registration.findOne({ userId: req.user._id, sessionId });
    if (existing) return res.status(400).json({ message: "Already registered for this session" });

    const registration = await Registration.create({ userId: req.user._id, expoId, sessionId });
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
