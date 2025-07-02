import express from "express";
import {
  getAllListings,
  getListingsByLocation,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/", getAllListings);
router.get("/by-location", getListingsByLocation);

export default router;
