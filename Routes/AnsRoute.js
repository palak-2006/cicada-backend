import express from "express";
import { handleAnsController } from "../Controllers/CheckController.js";
import { protectRoute } from "../Middleware/protectRoute.js";
const router = express.Router();

router.post("/ans", protectRoute, handleAnsController);

export default router;
