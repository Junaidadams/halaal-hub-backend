import express from "express";
import {
  register,
  login,
  verifyEmail,
  logout,
  addSaved,
  removeSaved,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/add-saved", addSaved);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.delete("/remove-saved", removeSaved);

router.get("/verify", verifyEmail);

export default router;
