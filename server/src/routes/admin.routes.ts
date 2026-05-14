import { Router } from "express";
import { callNextQueue, completeQueue, getAllQueues } from "../controllers/admin";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/queues", authMiddleware, getAllQueues);
router.post("/call-next", authMiddleware, callNextQueue);
router.patch("/:id/complete", authMiddleware, completeQueue);

export default router;