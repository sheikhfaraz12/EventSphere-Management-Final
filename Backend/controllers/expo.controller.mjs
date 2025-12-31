import Expo from "../models/Expo.mjs";
import Booth from "../models/Booth.mjs";
import Session from "../models/Session.mjs";

// Create Expo
// export const createExpo = async (req, res) => {
//   try {
//     const expo = await Expo.create({ ...req.body, createdBy: req.user._id });
//     res.status(201).json(expo);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const createExpo = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate } = req.body;

    // Validate required fields
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!startDate || !endDate)
      return res.status(400).json({ message: "Start date and end date are required" });

    // Create Expo
    const expo = await Expo.create({
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: req.user._id,
    });

    res.status(201).json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Expo
export const updateExpo = async (req, res) => {
  try {
    const expo = await Expo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Expo (also delete booths & sessions)
export const deleteExpo = async (req, res) => {
  try {
    const expo = await Expo.findByIdAndDelete(req.params.id);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    await Booth.deleteMany({ expoId: expo._id });
    await Session.deleteMany({ expoId: expo._id });

    res.json({ message: "Expo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Expos
export const getAllExpos = async (req, res) => {
  try {
    const expos = await Expo.find().populate("createdBy", "name email");
    res.json(expos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Expo
export const getSingleExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id).populate("createdBy", "name email");
    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
