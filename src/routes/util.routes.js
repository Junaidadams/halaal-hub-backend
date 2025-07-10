import express from "express";
import {
  getAddressFromGeocode,
  searchOSM,
  searchBusiness,
} from "../controllers/util.controller.js";

const router = express.Router();

router.get("/search-osm", searchOSM);
router.get("/search-business", searchBusiness);
router.get("/geocode", getAddressFromGeocode);

export default router;
