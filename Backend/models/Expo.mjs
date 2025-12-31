import mongoose from "mongoose";

const expoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Expo", expoSchema);
// import mongoose from "mongoose";

// const ExpoSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   startDate: { type: Date, required: true }, // ✅ must be Date
//   endDate: { type: Date, required: true },   // ✅ must be Date
//   // other fields...
// });

// export default mongoose.model("Expo", ExpoSchema);
