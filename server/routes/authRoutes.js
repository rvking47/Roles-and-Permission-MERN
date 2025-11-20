import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddlware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout/:id", authMiddleware, logout);

export default authRoutes;