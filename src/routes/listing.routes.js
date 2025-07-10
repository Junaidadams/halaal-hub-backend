import express from "express";
import {
  getAllListings,
  getListingsByLocation,
  getSpecificListings,
  bulkListingsUpdater,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/", getAllListings);
router.get("/by-location", getListingsByLocation);
router.post("/group", getSpecificListings);
router.post("/update-bulk", bulkListingsUpdater);

export default router;
