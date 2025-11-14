import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import roleRouter from "./routes/roleRoutes.js";
import permissionRouter from "./routes/permissionRoutes.js";

dotenv.config();
ConnectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/role", roleRouter);
app.use("/api/permission", permissionRouter);

const PORT = process.env.PORT || 7001

app.listen(PORT, () => {
    console.log(`Server is runinng at port http://localhost:${PORT}`)
});