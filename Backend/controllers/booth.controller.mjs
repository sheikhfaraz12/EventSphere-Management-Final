import Booth from "../models/Booth.mjs";
import Exhibitor from "../models/Exhibitor.mjs"; // 👈 MUST import Exhibitor

// Create Booths
export const createBooths = async (req, res) => {
  try {
    const booths = await Booth.insertMany(req.body); // [{expoId, boothNumber}, ...]
    res.status(201).json(booths);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Available Booths

export const getAvailableBooths = async (req, res) => {
  try {
    const { expoId } = req.params;

    // Fetch booths and populate exhibitor's user info
    const booths = await Booth.find({ expoId }).populate({
      path: "exhibitorId", // link to exhibitor
      select: "userId",     // only need userId
      populate: { path: "userId", select: "email" } // populate user's email
    });

    const formattedBooths = booths.map((b) => ({
      _id: b._id,
      number: b.boothNumber,
      isAvailable: b.isAvailable,
      exhibitorEmail: b.exhibitorId?.userId?.email || null,
    }));

    return res.json(formattedBooths);
  } catch (err) {
    console.error("Error fetching booths:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Select Booth
export const selectBooth = async (req, res) => {
  try {
    const { boothId } = req.params;

    const booth = await Booth.findById(boothId);
    if (!booth || !booth.isAvailable) {
      return res.status(400).json({ message: "Booth not available" });
    }

    // 👇 Find exhibitor record for this user & expo
    const exhibitor = await Exhibitor.findOne({
      userId: req.user._id,
      expoId: booth.expoId,
      status: "approved",
    });
    if (!exhibitor) {
      return res.status(403).json({ message: "You are not approved for this expo" });
    }

    // Assign booth to exhibitor
    booth.isAvailable = false;
    booth.exhibitorId = exhibitor._id;
    await booth.save();

    exhibitor.boothId = booth._id;
    await exhibitor.save();

    res.json({ booth, exhibitor });
  } catch (err) {
    console.error("Error selecting booth:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBoothsByExpo = async (req, res) => {
  try {
    const { expoId } = req.params;

    const booths = await Booth.find({ expoId })
      .populate({
        path: "exhibitorId",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    const formatted = booths.map(b => ({
      _id: b._id,
      boothNumber: b.boothNumber,
      status: b.isAvailable ? "Available" : "Occupied",
      exhibitor: b.exhibitorId
        ? {
            exhibitorId: b.exhibitorId._id,
            companyName: b.exhibitorId.companyName,
            user: b.exhibitorId.userId,
          }
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExhibitorById = async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id).populate("userId", "email");
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });
    res.json({ user: exhibitor.userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};