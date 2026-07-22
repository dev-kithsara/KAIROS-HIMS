import { Router } from "express";
import {
  createIncident,
  getDepartmentIncidents,
  acceptIncident,
  rejectIncident,
  assignInvestigator,
  assignActionOwner,
  reviewIncident,
  closeIncident,
} from "../controllers/incident.controller";
import upload from "../middleware/upload.middleware";

const router = Router();

// Route: POST /api/v1/incidents or /api/incidents
// Description: Submit a new incident report with up to 5 evidence file attachments (Staff)
router.post(
  "/",
  upload.array("evidence", 5),
  createIncident
);

// Route: GET /api/incidents/department/:departmentId
// Description: Get all incidents for a specific department
router.get("/department/:departmentId", getDepartmentIncidents);

// Route: PATCH /api/incidents/:id/accept
// Description: Accept an OPEN incident
router.patch("/:id/accept", acceptIncident);

// Route: PATCH /api/incidents/:id/reject
// Description: Reject an OPEN incident with a reason
router.patch("/:id/reject", rejectIncident);

// Route: PATCH /api/incidents/:id/assign-investigator
// Description: Assign an investigator to an ACCEPTED incident
router.patch("/:id/assign-investigator", assignInvestigator);

// Route: PATCH /api/incidents/:id/assign-action-owner
// Description: Assign an action owner to an INVESTIGATING incident
router.patch("/:id/assign-action-owner", assignActionOwner);

// Route: PATCH /api/incidents/:id/review
// Description: Mark an incident as UNDER_REVIEW
router.patch("/:id/review", reviewIncident);

// Route: PATCH /api/incidents/:id/close
// Description: Close the incident
router.patch("/:id/close", closeIncident);

export default router;