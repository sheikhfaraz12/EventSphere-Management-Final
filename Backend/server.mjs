import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/auth.routes..mjs";
import expoRoutes from "./routes/expo.routes.mjs";
import exhibitorRoutes from "./routes/exhibitor.routes.mjs";
import boothRoutes from "./routes/booth.routes.mjs";
import sessionRoutes from "./routes/session.routes.mjs";
import registrationRoutes from "./routes/registration.routes.mjs";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/exhibitors", exhibitorRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/registrations", registrationRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));