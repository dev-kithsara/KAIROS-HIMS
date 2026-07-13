import express from 'express';
import incidentRoutes from './routes/incident.routes';

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
app.use('/api/incidents', incidentRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'KAIROS HIMS Backend is running' });
});

export default app;