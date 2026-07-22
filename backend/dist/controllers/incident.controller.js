"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeIncident = exports.reviewIncident = exports.assignActionOwner = exports.assignInvestigator = exports.rejectIncident = exports.acceptIncident = exports.getDepartmentIncidents = exports.createIncident = void 0;
const zod_1 = require("zod");
const incident_validator_1 = require("../validators/incident.validator");
const incident_service_1 = require("../services/incident.service");
/**
 * Controller for creating a new incident report (Staff submission + attachments)
 */
const createIncident = async (req, res) => {
    try {
        const validatedData = incident_validator_1.incidentSchema.parse(req.body);
        const incident = await (0, incident_service_1.createIncidentService)(validatedData, req.files);
        return res.status(201).json({
            success: true,
            message: "Incident created successfully",
            incident,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }
        console.error("Error creating incident:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};
exports.createIncident = createIncident;
/**
 * Get all incidents for a specific department
 */
const getDepartmentIncidents = async (req, res) => {
    try {
        const departmentId = parseInt(req.params.departmentId, 10);
        if (isNaN(departmentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID provided in the URL.",
            });
        }
        const incidents = await incident_service_1.incidentService.getIncidentsByDepartment(departmentId);
        return res.status(200).json({
            success: true,
            data: incidents,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred on the server.",
        });
    }
};
exports.getDepartmentIncidents = getDepartmentIncidents;
/**
 * Accept an OPEN incident
 */
const acceptIncident = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID provided.",
            });
        }
        const updatedIncident = await incident_service_1.incidentService.acceptIncident(incidentId);
        return res.status(200).json({
            success: true,
            message: "Incident accepted successfully.",
            data: updatedIncident,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to accept incident.",
        });
    }
};
exports.acceptIncident = acceptIncident;
/**
 * Reject an OPEN incident with a reason
 */
const rejectIncident = async (req, res) => {
    try {
        const validatedData = incident_validator_1.rejectIncidentSchema.parse({ body: req.body });
        const reason = validatedData.body.reason;
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID provided.",
            });
        }
        const updatedIncident = await incident_service_1.incidentService.rejectIncident(incidentId, reason);
        return res.status(200).json({
            success: true,
            message: "Incident rejected successfully.",
            data: updatedIncident,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues?.map((e) => e.message) || ["Invalid input data"],
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reject incident.",
        });
    }
};
exports.rejectIncident = rejectIncident;
/**
 * Assign an investigator to an ACCEPTED incident
 */
const assignInvestigator = async (req, res) => {
    try {
        const validatedData = incident_validator_1.assignInvestigatorSchema.parse({ body: req.body });
        const investigatorId = validatedData.body.investigatorId;
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID provided.",
            });
        }
        const updatedIncident = await incident_service_1.incidentService.assignInvestigator(incidentId, investigatorId);
        return res.status(200).json({
            success: true,
            message: "Investigator assigned successfully.",
            data: updatedIncident,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues?.map((e) => e.message) || ["Invalid input data"],
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to assign investigator.",
        });
    }
};
exports.assignInvestigator = assignInvestigator;
/**
 * Assign an action owner to an INVESTIGATING incident
 */
const assignActionOwner = async (req, res) => {
    try {
        const validatedData = incident_validator_1.assignActionOwnerSchema.parse({ body: req.body });
        const actionOwnerId = validatedData.body.actionOwnerId;
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID provided.",
            });
        }
        const updatedIncident = await incident_service_1.incidentService.assignActionOwner(incidentId, actionOwnerId);
        return res.status(200).json({
            success: true,
            message: "Action owner assigned successfully.",
            data: updatedIncident,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues?.map((e) => e.message) || ["Invalid input data"],
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to assign action owner.",
        });
    }
};
exports.assignActionOwner = assignActionOwner;
/**
 * Mark an incident as UNDER_REVIEW
 */
const reviewIncident = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({ success: false, message: "Invalid incident ID provided." });
        }
        const updatedIncident = await incident_service_1.incidentService.reviewIncident(incidentId);
        return res.status(200).json({
            success: true,
            message: "Incident marked as UNDER_REVIEW.",
            data: updatedIncident,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to review incident.",
        });
    }
};
exports.reviewIncident = reviewIncident;
/**
 * Close the incident
 */
const closeIncident = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({ success: false, message: "Invalid incident ID provided." });
        }
        const updatedIncident = await incident_service_1.incidentService.closeIncident(incidentId);
        return res.status(200).json({
            success: true,
            message: "Incident closed successfully.",
            data: updatedIncident,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to close incident.",
        });
    }
};
exports.closeIncident = closeIncident;
