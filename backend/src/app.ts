import express from 'express';
import cors from 'cors';
import incidentRoutes from './routes/incident.routes';
import authRoutes from './routes/auth.routes';
import analyticsRoutes from './routes/analytics.routes';
import userRoutes from './routes/user.routes';
import { globalErrorHandler } from './middlewares/errorHandler.middleware'; // Import the handler

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

// Route mounting
app.use('/api/incidents', incidentRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
// Health Check Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KAIROS Backend is Running',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'KAIROS HIMS Backend is running' });
});

// IMPORTANT: The Global Error Handler MUST be the last middleware!
// If any route or middleware above calls next(error), it will come here.
app.use(globalErrorHandler);

export default app;
