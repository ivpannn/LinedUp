import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma  from '../utils/prisma';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            },
        });

        // return res.status(201).json({
        //     message: "debug"
        // });
        
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "User registered",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// Login function
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // check if entered password match hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // creates login token (fronted stores token, protected routes check token)
        const token = jwt.sign(
            {
                userId: user.id,
            },
            "SECRET_KEY",
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login success",
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};
