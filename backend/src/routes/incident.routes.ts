import { Router } from 'express';
import { getDepartmentIncidents ,acceptIncident} from '../controllers/incident.controller';

const router = Router();

// Route: GET /api/incidents/department/:departmentId
// Description: Get all incidents for a specific department
router.get('/department/:departmentId', getDepartmentIncidents);

// Route: PATCH /api/incidents/:id/accept
// Description: Accept an OPEN incident
// Access: Manager
router.patch('/:id/accept', acceptIncident); 

export default router;