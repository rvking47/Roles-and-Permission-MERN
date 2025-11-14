import express from "express";
import Role from "../models/roleModel.js";

const roleRouter = express.Router();

roleRouter.post("/create", async (req, res) => {
    const { name, permissions } = req.body;

    const role = new Role({
        name,
        permissions
    })
    await role.save();
    res.status(201).json({ mesaage: "Role created", role })
})

export default roleRouter;