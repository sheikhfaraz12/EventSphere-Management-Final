import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
