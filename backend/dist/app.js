"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const incident_routes_1 = __importDefault(require("./routes/incident.routes"));
const app = (0, express_1.default)();
/*
==========================================
Middleware
==========================================
*/
// Allow requests from the React frontend
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Parse JSON request body
app.use(express_1.default.json());
/*
==========================================
Routes
==========================================
*/
app.use("/api/v1/incidents", incident_routes_1.default);
app.use("/api/incidents", incident_routes_1.default);
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
exports.default = app;
