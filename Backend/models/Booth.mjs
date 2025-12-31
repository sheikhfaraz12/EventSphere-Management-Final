import mongoose from "mongoose";

const boothSchema = new mongoose.Schema({
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  boothNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booth", boothSchema);
