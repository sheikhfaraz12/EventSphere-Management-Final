import mongoose from "mongoose";

const exhibitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  companyName: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  boothId: { type: mongoose.Schema.Types.ObjectId, ref: "Booth", default: null }, // 👈 NEW
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Exhibitor", exhibitorSchema);
