import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
ConnectDB();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 7001

app.listen(PORT, () => {
    console.log(`Server is runinng at port http://localhost:${PORT}`)
});