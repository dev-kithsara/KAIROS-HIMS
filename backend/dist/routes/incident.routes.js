"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incident_controller_1 = require("../controllers/incident.controller");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ==========================================
// SECURED ROUTES
// All routes below require a valid JWT token
// ==========================================
// Route: POST /api/v1/incidents or /api/incidents
// Description: Submit a new incident report with up to 5 evidence file attachments (Staff)
router.post("/", auth_middleware_1.authenticate, // 1. Check if user is logged in (has valid token)
(0, auth_middleware_1.authorizeRoles)("STAFF"), // 2. Check if user has the 'STAFF' role
upload_middleware_1.default.array("evidence", 5), // 3. Handle file uploads (up to 5 files)
incident_controller_1.createIncident);
// Route: GET /api/incidents/action-owner
// Description: Get incidents assigned to the logged-in Action Owner
// Access: ACTION_OWNER only
router.get("/action-owner", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ACTION_OWNER"), incident_controller_1.getActionOwnerIncidents);
// Route: PATCH /api/incidents/:id/corrective-action
// Description: Action Owner submits corrective action
// Access: ACTION_OWNER only
router.patch("/:id/corrective-action", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ACTION_OWNER"), incident_controller_1.submitCorrectiveAction);
// Route: GET /api/incidents/department/:departmentId
// Description: Get all incidents for a specific department
// Access: MANAGER only
router.get('/department/:departmentId', auth_middleware_1.authenticate, // 1. Check if user is logged in (has valid token)
(0, auth_middleware_1.authorizeRoles)('MANAGER', 'STAFF'), // 2. Check if user has the 'MANAGER','STAFF' role
incident_controller_1.getDepartmentIncidents // 3. If both pass, execute the controller
);
// Route: PATCH /api/incidents/:id/accept
// Description: Accept an OPEN incident
// Access: MANAGER only
router.patch("/:id/accept", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.acceptIncident);
// Route: PATCH /api/incidents/:id/reject
// Description: Reject an OPEN incident with a reason
// Access: MANAGER only
router.patch("/:id/reject", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.rejectIncident);
// Route: PATCH /api/incidents/:id/assign-investigator
// Description: Assign an investigator to an ACCEPTED incident
// Access: MANAGER only
router.patch("/:id/assign-investigator", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.assignInvestigator);
// Route: PATCH /api/incidents/:id/assign-action-owner
// Description: Assign an action owner to an INVESTIGATING incident
// Access: MANAGER only
router.patch("/:id/assign-action-owner", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.assignActionOwner);
// Route: PATCH /api/incidents/:id/review
// Description: Mark an incident as UNDER_REVIEW
// Access: MANAGER only
router.patch("/:id/review", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.reviewIncident);
// Route: PATCH /api/incidents/:id/close
// Description: Close the incident
// Access: MANAGER only
router.patch("/:id/close", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MANAGER'), incident_controller_1.closeIncident);
// Route: GET /api/v1/incidents/investigator
// Description: Get incidents assigned to the logged-in investigator
router.get("/investigator", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("INVESTIGATOR"), incident_controller_1.getAssignedIncidents);
// Route: PATCH /api/v1/incidents/:id/root-cause
// Description: Investigator submits Root Cause Analysis findings
router.patch("/:id/root-cause", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("INVESTIGATOR"), incident_controller_1.submitRootCause);
// Route: GET /api/v1/incidents/:id
// Description: Get a single incident by ID with related data
// NOTE: Registered last so it does not shadow /action-owner or /investigator
router.get("/:id", auth_middleware_1.authenticate, incident_controller_1.getIncidentById);
exports.default = router;
