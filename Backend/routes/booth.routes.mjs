import express from "express";
import { createBooths, getAvailableBooths, getBoothsByExpo, getExhibitorById, selectBooth } from "../controllers/booth.controller.mjs";
import { protect } from "../middleware/auth.middleware.mjs";
import { isAdmin, isExhibitor } from "../middleware/role.middleware.mjs";

const router = express.Router();

// Admin creates booths
router.post("/", protect, isAdmin, createBooths);

// Get available booths for an expo (any logged-in user)
router.get("/available/:expoId", protect, getAvailableBooths);

// Exhibitor selects a booth
router.put("/select/:boothId", protect, isExhibitor, selectBooth);
// Admin: get all booths of an expo
router.get("/expo/:expoId", protect, isAdmin, getBoothsByExpo);
router.get("/:id", protect, isAdmin, getExhibitorById);


export default router;
