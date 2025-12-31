import express from "express";
import { getUserRegistrations, registerExpo, registerSession } from "../controllers/registration.controller.mjs";
import { protect } from "../middleware/auth.middleware.mjs";
import { isAttendee } from "../middleware/role.middleware.mjs";

const router = express.Router();

// Attendee registers for expo
router.post("/expo", protect, isAttendee, registerExpo);

// Attendee registers for session
router.post("/session", protect, isAttendee, registerSession);
// Get all expos the current user is registered for
router.get("/user", protect, getUserRegistrations);

export default router;
