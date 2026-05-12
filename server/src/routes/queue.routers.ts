import express from "express";
import { joinQueue, leaveQueue, getQueue } from "../controllers/queue";

import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/join", authMiddleware, joinQueue);
router.post("/leave", authMiddleware, leaveQueue);
router.get("/", authMiddleware, getQueue);

export default router;
