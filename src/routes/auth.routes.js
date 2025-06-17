import express from "express";
import {
  register,
  login,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify", verifyEmail);
router.post("/login", login);

export default router;
