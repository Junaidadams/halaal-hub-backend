import express from "express";
import {
  getAddressFromGeocode,
  searchOSM,
} from "../controllers/util.controller.js";

const router = express.Router();

router.get("/search-osm", searchOSM);
router.get("/geocode", getAddressFromGeocode);

export default router;
