import express from "express";
import {
  getAllListings,
  getListingsByLocation,
  getSpecificListings,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/", getAllListings);
router.get("/by-location", getListingsByLocation);
router.post("/group", getSpecificListings);

export default router;
