import express from "express";
import { createSession, updateSession, getSessionsByExpo } from "../controllers/session.controller.mjs";
import { protect } from "../middleware/auth.middleware.mjs";
import { isAdmin } from "../middleware/role.middleware.mjs";

const router = express.Router();

// Admin creates session
router.post("/", protect, isAdmin, createSession);

// Admin updates session
router.put("/:id", protect, isAdmin, updateSession);

// Get all sessions for an expo (any logged-in user)
router.get("/expo/:expoId", protect, getSessionsByExpo);

export default router;
