import { Router } from 'express';
import {    getDepartmentIncidents ,
            acceptIncident , 
            rejectIncident, 
            assignInvestigator, 
            assignActionOwner ,
            reviewIncident, 
            closeIncident} from '../controllers/incident.controller';


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

//Route:PATCH /:id/assign-action-owner
// Description: Assign an action owner to an INVESTIGATING incident
router.patch('/:id/assign-action-owner' , assignActionOwner);

// Route: PATCH /api/incidents/:id/review
// Description: Mark an incident as UNDER_REVIEW
// Access: Manager
router.patch('/:id/review', reviewIncident);

// Route: PATCH /api/incidents/:id/close
// Description: Close the incident
// Access: Manager
router.patch('/:id/close', closeIncident);

export default router;