import express, { Application } from "express";
import dotenv from "dotenv";

// // Importar rutas
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import planRoutes from "./routes/planRoutes";
import eventRoutes from "./routes/eventRoutes";

dotenv.config();

const app: Application = express();

// Middlewares globales
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/plans", planRoutes);
app.use("/events", eventRoutes);

export default app;
