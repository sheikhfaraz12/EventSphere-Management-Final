import express from "express";
import {
  applyExhibitor,
  approveExhibitor,
  getExhibitorsByExpo,
  getExhibitorsByUser,
  getPendingExhibitors, // 👈 ADD
} from "../controllers/exhibitor.controller.mjs";

import { protect } from "../middleware/auth.middleware.mjs";
import { isAdmin, isExhibitor } from "../middleware/role.middleware.mjs";

const router = express.Router();

// Exhibitor applies for an expo
router.post("/apply", protect, isExhibitor, applyExhibitor);
router.get("/pending", protect, isAdmin, getPendingExhibitors);
// Admin approves exhibitor
router.put("/approve/:id", protect, isAdmin, approveExhibitor);

// Get all exhibitors for an expo
router.get("/expo/:expoId", protect, getExhibitorsByExpo);
router.get("/user", protect, isExhibitor, getExhibitorsByUser);

export default router;
