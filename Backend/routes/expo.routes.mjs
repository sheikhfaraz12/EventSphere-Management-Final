import express from "express";
import {
  createExpo,
  updateExpo,
  deleteExpo,
  getAllExpos,
  getSingleExpo,
} from "../controllers/expo.controller.mjs";
import { protect } from "../middleware/auth.middleware.mjs";
import { isAdmin } from "../middleware/role.middleware.mjs";

const router = express.Router();

router.post("/", protect, isAdmin, createExpo);
router.put("/:id", protect, isAdmin, updateExpo);
router.delete("/:id", protect, isAdmin, deleteExpo);
router.get("/", getAllExpos);
router.get("/:id", getSingleExpo);

export default router;
