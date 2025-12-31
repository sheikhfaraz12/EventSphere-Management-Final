import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Registration", registrationSchema);
