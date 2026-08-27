import express from "express";
import { HealthController as HealthController } from "../controllers/health/index.js";

const router = express.Router();

router.get('/', HealthController);

export default router;
