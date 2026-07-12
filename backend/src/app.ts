import express from 'express';

const app = express();

/*
==========================================
Middleware
==========================================
*/

// Parse JSON request body
app.use(express.json());

/*
==========================================
Routes
==========================================
*/

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KAIROS Backend is Running",
  });
});

export default app;