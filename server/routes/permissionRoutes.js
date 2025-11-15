import express from "express";
import authMiddleware from "../middlewares/authMiddlware.js";
import { create, distroy, single, update, view } from "../controllers/permissionController.js";

const permissionRouter = express.Router();

permissionRouter.post("/create", authMiddleware, create);
permissionRouter.get("/view", authMiddleware, view);
permissionRouter.get("/single/:id", authMiddleware, single);
permissionRouter.delete("/distroy/:id", authMiddleware, distroy);
permissionRouter.put("/update/:id", authMiddleware, update);

export default permissionRouter;