import express from "express";
import Permission from "../models/permissionModel.js";

const permissionRouter = express.Router();

permissionRouter.post("/create", async (req, res) => {
    const { name, description } = req.body;

    const role = new Permission({
        name,
        description
    })
    await role.save();
    res.status(201).json({ mesaage: "Role created", role })
})

export default permissionRouter;