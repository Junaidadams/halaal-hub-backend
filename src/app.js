import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import utilRoutes from "./routes/util.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/util", utilRoutes);
app.use("/api/listings", listingRoutes);

export default app;
