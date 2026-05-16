import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../utils/prisma";

const getStartOfDay = (): Date => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
};

export const joinQueue = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const { restaurantId } = req.body;

        if (!restaurantId) {
            return res.status(400).json({ message: "restaurantId is required" });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
        });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Check across ALL days, not just today — prevents ghost blocks from old records
        const existingQueue = await prisma.queue.findFirst({
            where: {
                userId,
                status: { in: ["WAITING", "SERVING"] },
            },
        });

        if (existingQueue) {
            return res.status(400).json({ message: "Already in queue" });
        }

        const todayCount = await prisma.queue.count({
            where: {
                restaurantId,
                joinedAt: { gte: getStartOfDay() },
            },
        });

        const nextQueueNumber = todayCount + 1;

        const queue = await prisma.queue.create({
            data: {
                queueNumber: nextQueueNumber,
                userId,
                restaurantId,
            },
            include: {
                restaurant: { select: { name: true } },
            },
        });

        return res.status(201).json({ message: "Joined queue", queue });
    } catch (error) {
        console.log("joinQueue error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const leaveQueue = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        // Include SERVING so user is never stuck
        const queue = await prisma.queue.findFirst({
            where: {
                userId,
                status: { in: ["WAITING", "SERVING"] },
            },
        });

        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }

        const updatedQueue = await prisma.queue.update({
            where: { id: queue.id },
            data: { status: "LEFT" },
        });

        return res.status(200).json({ message: "Left queue", updatedQueue });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getQueue = async (req: AuthRequest, res: Response) => {
    try {
        const { restaurantId } = req.query;

        const queue = await prisma.queue.findMany({
            where: {
                status: { in: ["WAITING", "SERVING"] },
                joinedAt: { gte: getStartOfDay() },
                ...(restaurantId ? { restaurantId: String(restaurantId) } : {}),
            },
            include: {
                user: { select: { id: true, name: true } },
                restaurant: { select: { name: true } },
            },
            orderBy: { queueNumber: "asc" },
        });

        return res.status(200).json({ queue });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};