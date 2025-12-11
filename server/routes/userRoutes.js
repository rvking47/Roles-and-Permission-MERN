import express from "express";
import authMiddleware from "../middlewares/authMiddlware.js";
import authorizeRole from "../middlewares/roleMiddlware.js";
import { view, update, newuser, single, distroy, checkPermission } from "../controllers/userController.js";

const userRoutes = express.Router();

//only admin can access this router
userRoutes.get("/admin", authMiddleware, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!" })
})

//only admin and manager can access this router
userRoutes.get("/manager", authMiddleware, authorizeRole("admin", "manager"), (req, res) => {
    res.json({ message: "Welcome Manager!" })
})

//All can access this route
userRoutes.get("/user", authMiddleware, authorizeRole("admin", "manager", "user"), (req, res) => {
    res.json({ message: "Welcome User!" })
})


// create total user route
userRoutes.get("/view", authMiddleware, view);
userRoutes.get("/single/:id", authMiddleware, single);

// update user route
userRoutes.put("/update/:id", authMiddleware, update);


// new register route
userRoutes.get("/newusers", authMiddleware, newuser);

//delete user route
userRoutes.delete("/distroy/:id", authMiddleware, distroy);

userRoutes.get("/me", authMiddleware, checkPermission);




export default userRoutes;

