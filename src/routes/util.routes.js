import express from "express";
import {
  getAddressFromGeocode,
  searchOSM,
  searchBusiness,
  searchAddress,
  reportIssue,
} from "../controllers/util.controller.js";

const router = express.Router();

router.post("/report-issue", reportIssue);

router.get("/search-osm", searchOSM);
router.get("/search-address", searchAddress);
router.get("/search-business", searchBusiness);
router.get("/geocode", getAddressFromGeocode);

export default router;
