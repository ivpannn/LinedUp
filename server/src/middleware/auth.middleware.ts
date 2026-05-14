import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

// Gets JWT token from frontend (Protects routes, without token access denied)
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY") as {
            userId: string;
        };

        // stores current logged-in user
        req.userId = decoded.userId;

        next(); //continue next function
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
};