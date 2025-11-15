import express from "express";
import authMiddleware from "../middlewares/authMiddlware.js";
import { create, distroy, single, update, view } from "../controllers/roleController.js";

const roleRouter = express.Router();

roleRouter.post("/create", authMiddleware, create);
roleRouter.get("/view", authMiddleware, view);
roleRouter.get("/single/:id", authMiddleware, single);
roleRouter.delete("/distroy/:id", authMiddleware, distroy);
roleRouter.put("/update/:id", authMiddleware, update);

export default roleRouter;