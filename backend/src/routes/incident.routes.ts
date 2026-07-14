import { Router } from 'express';
import { getDepartmentIncidents ,acceptIncident , rejectIncident, assignInvestigator} from '../controllers/incident.controller';

const router = Router();

// Route: GET /api/incidents/department/:departmentId
// Description: Get all incidents for a specific department
router.get('/department/:departmentId', getDepartmentIncidents);

// Route: PATCH /api/incidents/:id/accept
// Description: Accept an OPEN incident
router.patch('/:id/accept', acceptIncident); 

// Route: PATCH /api/incidents/:id/reject
// Description: Reject an OPEN incident with a reason
router.patch('/:id/reject', rejectIncident); 

// Route: PATCH /api/incidents/:id/assign-investigator
// Description: Assign an investigator to an ACCEPTED incident
router.patch('/:id/assign-investigator', assignInvestigator); 

export default router;