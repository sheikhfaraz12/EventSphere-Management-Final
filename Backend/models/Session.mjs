import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  title: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Session", sessionSchema);
