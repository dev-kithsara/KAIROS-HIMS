"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incident_controller_1 = require("../controllers/incident.controller");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const router = (0, express_1.Router)();
// Route: POST /api/v1/incidents or /api/incidents
// Description: Submit a new incident report with up to 5 evidence file attachments (Staff)
router.post("/", upload_middleware_1.default.array("evidence", 5), incident_controller_1.createIncident);
// Route: GET /api/incidents/department/:departmentId
// Description: Get all incidents for a specific department
router.get("/department/:departmentId", incident_controller_1.getDepartmentIncidents);
// Route: PATCH /api/incidents/:id/accept
// Description: Accept an OPEN incident
router.patch("/:id/accept", incident_controller_1.acceptIncident);
// Route: PATCH /api/incidents/:id/reject
// Description: Reject an OPEN incident with a reason
router.patch("/:id/reject", incident_controller_1.rejectIncident);
// Route: PATCH /api/incidents/:id/assign-investigator
// Description: Assign an investigator to an ACCEPTED incident
router.patch("/:id/assign-investigator", incident_controller_1.assignInvestigator);
// Route: PATCH /api/incidents/:id/assign-action-owner
// Description: Assign an action owner to an INVESTIGATING incident
router.patch("/:id/assign-action-owner", incident_controller_1.assignActionOwner);
// Route: PATCH /api/incidents/:id/review
// Description: Mark an incident as UNDER_REVIEW
router.patch("/:id/review", incident_controller_1.reviewIncident);
// Route: PATCH /api/incidents/:id/close
// Description: Close the incident
router.patch("/:id/close", incident_controller_1.closeIncident);
exports.default = router;
