import Exhibitor from "../models/Exhibitor.mjs";
import Booth from "../models/Booth.mjs";

// Apply as Exhibitor
export const applyExhibitor = async (req, res) => {
  try {
    const existing = await Exhibitor.findOne({ userId: req.user._id, expoId: req.body.expoId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const exhibitor = await Exhibitor.create({ ...req.body, userId: req.user._id });
    res.status(201).json(exhibitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve Exhibitor (Admin)
export const approveExhibitor = async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });

    exhibitor.status = "approved";
    await exhibitor.save();

    // Optionally assign booth automatically
    const booth = await Booth.findOne({ expoId: exhibitor.expoId, isAvailable: true });
    if (booth) {
      booth.isAvailable = false;
      booth.exhibitorId = exhibitor._id;
      await booth.save();
    }

    res.json({ exhibitor, boothAssigned: booth || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPendingExhibitors = async (req, res) => {
  try {
    const pending = await Exhibitor.find({ status: "pending" })
      .populate("userId", "name email");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Exhibitors by Expo
export const getExhibitorsByExpo = async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find({ expoId: req.params.expoId }).populate("userId", "name email");
    res.json(exhibitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all applications of the logged-in exhibitor
export const getExhibitorsByUser = async (req, res) => {
  try {
    const applications = await Exhibitor.find({ userId: req.user._id })
      .populate("expoId", "_id title")   // get expo info
      .populate("boothId", "_id boothNumber"); // get booth info

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching applications" });
  }
};

