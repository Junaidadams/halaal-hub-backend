import express from "express";
import {
  getAllListings,
  getListingsByLocation,
  getSpecificListings,
  bulkListingsUpdater,
  getListingById,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/", getAllListings);
router.get("/by-location", getListingsByLocation);
router.get("/:id", getListingById);
router.post("/group", getSpecificListings);
router.post("/update-bulk", bulkListingsUpdater);

export default router;
