import { Response } from "express";
import prisma from "../utils/prisma";

import { AuthRequest } from "../middleware/auth.middleware";

// join queue
export const joinQueue = async (req: AuthRequest, res: Response,) => {
    try {
        const userId = req.userId!;

        // check existing active queue (gets first matching db record)
        const existingQueue = await prisma.queue.findFirst({
            where: {
                userId,
                status: "WAITING",
            },
        });

        // prevent user joining many times
        if (existingQueue) {
            return res.status(400).json({
                message: "Already in queue",
            });
        }

        // latest queue number
        const lastestQueue = await prisma.queue.findFirst({
            orderBy: {
                queueNumber: 'desc',
            },
        });

        // new queue number
        const nextQueueNumber = lastestQueue ? lastestQueue.queueNumber + 1 : 1;

        // create queue
        const queue = await prisma.queue.create({
            data: {
                queueNumber: nextQueueNumber,
                userId: userId!, // ! = guarantee this exists
            },
        });

        return res.status(201).json({
            message: "Joined queue",
            queue,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// cancel queue (Left)
export const leaveQueue = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        const queue = await prisma.queue.findFirst({
            where: {
                userId,
                status: "WAITING",
            },
        });

        if (!queue) {
            return res.status(404).json({
                message: "Queue not found",
            });
        }

        const updatedQueue = await prisma.queue.update({
            where: {
                id: queue.id,
            },
            data: {
                status: "LEFT",
            },

        });

        return res.status(200).json({
            message: "Left queue",
            updatedQueue,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// get all queue
export const getQueue = async (req: AuthRequest, res: Response) => {
    try {
        const queue = await prisma.queue.findMany({
            where: {
                status: "WAITING",
            },
            include: {
                user: true, //also return user info
            },
            orderBy: {
                queueNumber: "asc",
            },
        });

        return res.status(200).json({
            queue,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};