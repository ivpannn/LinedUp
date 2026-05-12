import express from "express";
import { register, login } from "../controllers/auth";

const router = express.Router();

// create API endpoint
router.post("/register", register);
router.post("/login", login);

export default router;

// Frontend
// → Route
// → Controller
// → Database
// → Response