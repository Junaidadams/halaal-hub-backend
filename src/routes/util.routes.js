import express from "express";
import { searchBusiness } from "../controllers/util.controller.js";

const router = express.Router();

router.get("/search-business", searchBusiness);

export default router;
