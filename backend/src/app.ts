import express from "express";
import cors from "cors";
import incidentRoutes from "./routes/incident.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

/*
==========================================
Middleware
==========================================
*/

// Allow requests from the React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request body
app.use(express.json());

/*
==========================================
Routes
==========================================
*/

app.use("/api/incidents", incidentRoutes);
app.use("/api/auth", authRoutes);

// Health Check Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KAIROS Backend is Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "KAIROS HIMS Backend is running" });
});

export default app;