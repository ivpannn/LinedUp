import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../utils/prisma";

export const getAllQueues = async (req: AuthRequest, res: Response) => {
    try {
        const queues = await prisma.queue.findMany({
            orderBy: {
                queueNumber: "asc",
            },

            include: {
                user: true,
            },
        });

        return res.json(queues);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fecth queues",
        });
    }
};

export const callNextQueue = async (req: AuthRequest, res: Response) => {
    try {
        const nextQueue = await prisma.queue.findFirst({
            where: {
                status: "WAITING",
            },

            orderBy: {
                queueNumber: "asc",
            },
        });

        if (!nextQueue) {
            return res.status(404).json({
                message: "No waiting queue",
            });
        }

        await prisma.queue.update({
            where: {
                id: nextQueue.id,
            },

            data: {
                status: "SERVING",
            },
        });

        return res.json({
            message: "Next queue called",
            nextQueue,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to call next queue",
        });
    }
};

export const completeQueue = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid queue id",
            });
        }

        await prisma.queue.update({
            where: {
                id,
            },

            data: {
                status: "COMPLETED",
            },
        });

        return res.json({
            message: "Queue completed",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to complete queue",
        });
    }
};