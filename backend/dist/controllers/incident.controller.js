"use strict";
// backend/src/controllers/incident.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitRootCause = exports.submitCorrectiveAction = exports.getActionOwnerIncidents = exports.getAssignedIncidents = exports.closeIncident = exports.reviewIncident = exports.assignActionOwner = exports.assignInvestigator = exports.rejectIncident = exports.acceptIncident = exports.getIncidentById = exports.getDepartmentIncidents = exports.createIncident = void 0;
const incident_validator_1 = require("../validators/incident.validator");
const rootCause_validator_1 = require("../validators/rootCause.validator");
const incident_service_1 = require("../services/incident.service");
const catchAsync_1 = require("../utils/catchAsync"); // Import our magic wrapper
const AppError_1 = require("../utils/AppError");
/**
 * Controller for creating a new incident report
 * Wrapped in catchAsync to automatically handle errors
 */
exports.createIncident = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // 1. Validate input using Zod
    const validatedData = incident_validator_1.incidentSchema.parse(req.body);
    // 2. Security Check (FIX FOR BUG-01)
    // Ensure the user is authenticated before creating an incident.
    if (!req.user) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    // 3. Override the reporterId with the securely verified ID from the JWT token.
    // This prevents malicious users from submitting incidents on behalf of others.
    const incidentData = {
        ...validatedData,
        reporterId: req.user.id,
    };
    // 4. Call service with the securely validated data
    const incident = await (0, incident_service_1.createIncidentService)(incidentData, req.files);
    // 5. Send response
    return res.status(201).json({
        success: true,
        message: 'Incident created successfully',
        incident,
    });
});
exports.getDepartmentIncidents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const params = incident_validator_1.departmentParamsSchema.parse(req.params);
    const departmentId = params.departmentId;
    const incidents = await incident_service_1.incidentService.getIncidentsByDepartment(departmentId);
    return res.status(200).json({ success: true, data: incidents });
});
exports.getIncidentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const incidentId = Number(req.params.id);
    const incident = await incident_service_1.incidentService.getIncidentById(incidentId);
    return res.status(200).json({ success: true, data: incident });
});
exports.acceptIncident = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.acceptIncident(incidentId);
    return res
        .status(200)
        .json({ success: true, message: 'Incident accepted.', data: updatedIncident });
});
exports.rejectIncident = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const validatedData = incident_validator_1.rejectIncidentSchema.parse({ body: req.body });
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.rejectIncident(incidentId, validatedData.body.reason);
    return res
        .status(200)
        .json({ success: true, message: 'Incident rejected.', data: updatedIncident });
});
exports.assignInvestigator = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const validatedData = incident_validator_1.assignInvestigatorSchema.parse({ body: req.body });
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.assignInvestigator(incidentId, validatedData.body.investigatorId);
    return res
        .status(200)
        .json({ success: true, message: 'Investigator assigned successfully.', data: updatedIncident });
});
exports.assignActionOwner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const validatedData = incident_validator_1.assignActionOwnerSchema.parse({ body: req.body });
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.assignActionOwner(incidentId, validatedData.body.actionOwnerId);
    return res
        .status(200)
        .json({ success: true, message: 'Action owner assigned successfully.', data: updatedIncident });
});
exports.reviewIncident = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.reviewIncident(incidentId);
    return res
        .status(200)
        .json({ success: true, message: 'Incident marked as UNDER_REVIEW.', data: updatedIncident });
});
exports.closeIncident = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId))
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    const updatedIncident = await incident_service_1.incidentService.closeIncident(incidentId);
    return res
        .status(200)
        .json({ success: true, message: 'Incident closed.', data: updatedIncident });
});
/**
 * Get incidents assigned to investigator
 * Feature 4 - Investigator Workspace
 */
exports.getAssignedIncidents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError('User not authenticated.', 401);
    }
    const investigatorId = req.user.id;
    const incidents = await incident_service_1.incidentService.getAssignedIncidents(investigatorId);
    return res.status(200).json({
        success: true,
        data: incidents,
    });
});
/**
 * Get incidents assigned to the logged-in Action Owner
 * Feature 5 - Action Owner Workspace
 */
exports.getActionOwnerIncidents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError('User not authenticated.', 401);
    }
    const actionOwnerId = req.user.id;
    const incidents = await incident_service_1.incidentService.getActionOwnerIncidents(actionOwnerId);
    return res.status(200).json({
        success: true,
        data: incidents,
    });
});
/**
 * Submit corrective action
 * Feature 5 - Action Owner Workspace
 */
exports.submitCorrectiveAction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError('User not authenticated.', 401);
    }
    const incidentId = Number(req.params.id);
    if (isNaN(incidentId)) {
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    }
    const correctiveAction = req.body.correctiveAction;
    if (typeof correctiveAction !== 'string' ||
        correctiveAction.trim().length < 20) {
        throw new AppError_1.AppError('Corrective action must be at least 20 characters long.', 400);
    }
    const updatedIncident = await incident_service_1.incidentService.submitCorrectiveAction(incidentId, req.user.id, correctiveAction);
    return res.status(200).json({
        success: true,
        message: 'Corrective action submitted successfully.',
        data: updatedIncident,
    });
});
/**
 * Submit Root Cause Analysis findings
 * Investigator submits RCA details
 */
exports.submitRootCause = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const validatedData = rootCause_validator_1.rootCauseSchema.parse(req.body);
    const incidentId = Number(req.params.id);
    if (isNaN(incidentId)) {
        throw new AppError_1.AppError('Invalid incident ID provided.', 400);
    }
    const updatedIncident = await incident_service_1.incidentService.submitRootCause(incidentId, validatedData.rootCause, validatedData.rootCauseCategory);
    return res.status(200).json({
        success: true,
        message: 'Root cause submitted successfully',
        data: updatedIncident,
    });
});
