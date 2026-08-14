"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidentService = exports.IncidentService = exports.createIncidentService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const incident_repository_1 = require("../repositories/incident.repository");
const AppError_1 = require("../utils/AppError");
/**
 * Service function for creating an incident (Staff Submission + Attachments)
 */
const createIncidentService = async (data, files) => {
    const departmentId = Number(data.departmentId);
    const reporterId = Number(data.reporterId);
    if (!departmentId || departmentId <= 0) {
        throw new AppError_1.AppError('Invalid department ID provided.', 400);
    }
    if (!reporterId || reporterId <= 0) {
        throw new AppError_1.AppError('Invalid reporter ID provided.', 400);
    }
    const [departmentExists, reporterExists] = await Promise.all([
        prisma_1.default.department.findUnique({ where: { id: departmentId } }),
        prisma_1.default.user.findUnique({ where: { id: reporterId } }),
    ]);
    if (!departmentExists) {
        throw new AppError_1.AppError('The selected department does not exist.', 404);
    }
    if (!reporterExists) {
        throw new AppError_1.AppError('The reporter user does not exist.', 404);
    }
    const incident = await prisma_1.default.incident.create({
        data: {
            title: data.title,
            description: data.description,
            severity: data.severity,
            category: data.category,
            location: data.location,
            status: 'OPEN',
            departmentId,
            reporterId,
        },
    });
    if (files && files.length > 0) {
        await prisma_1.default.incidentAttachment.createMany({
            data: files.map((file) => ({
                fileName: file.originalname,
                filePath: file.path,
                fileType: file.mimetype,
                incidentId: incident.id,
            })),
        });
    }
    return incident;
};
exports.createIncidentService = createIncidentService;
class IncidentService {
    /**
     * Create a new incident (Staff Incident Submission)
     */
    async createIncident(data, files) {
        return (0, exports.createIncidentService)(data, files);
    }
    /**
     * Get a single incident by its ID with related data
     * @param id - The ID of the incident
     * @returns The incident with relations, or 404 if not found
     */
    async getIncidentById(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError_1.AppError('Invalid incident ID provided.', 400);
        }
        const incident = await incident_repository_1.incidentRepository.findByIdWithRelations(id);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404);
        }
        return incident;
    }
    /**
     * Get all incidents for a specific department
     * @param departmentId - The ID of the manager's department
     * @returns Array of incidents
     */
    async getIncidentsByDepartment(departmentId) {
        if (!departmentId || departmentId <= 0) {
            throw new AppError_1.AppError('Invalid Department ID provided', 400); // Bad Request
        }
        // FIX FOR BUG-02: Check if the department actually exists first
        const departmentExists = await prisma_1.default.department.findUnique({
            where: { id: departmentId },
        });
        if (!departmentExists) {
            throw new AppError_1.AppError('Department not found.', 404); // Not Found
        }
        return await incident_repository_1.incidentRepository.findByDepartmentId(departmentId);
    }
    /**
     * Accept an OPEN incident
     * @param incidentId - The ID of the incident to accept
     * @returns The updated incident
     */
    async acceptIncident(incidentId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404); // Not Found
        }
        if (incident.status !== 'OPEN') {
            throw new AppError_1.AppError(`Cannot accept incident. Current status is ${incident.status}, but expected OPEN.`, 409);
        }
        return await incident_repository_1.incidentRepository.updateStatus(incidentId, 'ACCEPTED');
    }
    /**
     * Reject an OPEN incident with a reason
     * @param incidentId - The ID of the incident to reject
     * @param reason - The mandatory reason for rejection
     * @returns The updated incident
     */
    async rejectIncident(incidentId, reason) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404);
        }
        if (incident.status !== 'OPEN') {
            throw new AppError_1.AppError(`Cannot reject incident. Current status is ${incident.status}, but expected OPEN.`, 409);
        }
        return await incident_repository_1.incidentRepository.rejectIncident(incidentId, reason);
    }
    /**
     * Assign an investigator to an ACCEPTED incident
     * @param incidentId - The ID of the incident
     * @param investigatorId - The ID of the user to be assigned
     * @returns The updated incident
     */
    async assignInvestigator(incidentId, investigatorId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404);
        }
        if (incident.status !== 'ACCEPTED') {
            throw new AppError_1.AppError(`Cannot assign investigator. Current status is ${incident.status}, but expected ACCEPTED.`, 409);
        }
        const investigator = await prisma_1.default.user.findUnique({
            where: { id: investigatorId },
        });
        if (!investigator) {
            throw new AppError_1.AppError('The specified investigator does not exist.', 404);
        }
        if (investigator.role !== 'INVESTIGATOR' && investigator.role !== 'MANAGER') {
            throw new AppError_1.AppError('The specified user does not have the required role to be an investigator.', 403);
        }
        return await incident_repository_1.incidentRepository.assignInvestigator(incidentId, investigatorId);
    }
    /**
     * Assign Action Owner to an INVESTIGATING incident
     * @param incidentId - The ID of the incident
     * @param actionOwnerId - The ID of the user assigned to own the action
     * @returns The updated incident
     */
    async assignActionOwner(incidentId, actionOwnerId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404);
        }
        if (incident.status !== 'INVESTIGATING') {
            throw new AppError_1.AppError(`Cannot assign action owner. Current status is ${incident.status}, but expected INVESTIGATING.`, 409);
        }
        const actionOwner = await prisma_1.default.user.findUnique({
            where: { id: actionOwnerId },
        });
        if (!actionOwner) {
            throw new AppError_1.AppError('The specified action owner does not exist.', 404);
        }
        if (actionOwner.role !== 'ACTION_OWNER' && actionOwner.role !== 'MANAGER') {
            throw new AppError_1.AppError('The specified user does not have the required role to be an action owner.', 403);
        }
        return await incident_repository_1.incidentRepository.assignActionOwner(incidentId, actionOwnerId);
    }
    /**
     * Mark an incident as UNDER_REVIEW
     * @param incidentId - The ID of the incident
     * @returns The updated incident
     */
    async reviewIncident(incidentId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident)
            throw new AppError_1.AppError('Incident not found.', 404);
        if (incident.status !== 'PENDING_ACTION') {
            throw new AppError_1.AppError(`Cannot review incident. Current status is ${incident.status}, but expected PENDING_ACTION.`, 409);
        }
        return await incident_repository_1.incidentRepository.reviewIncident(incidentId);
    }
    /**
     * Close the incident
     * @param incidentId - The ID of the incident
     * @returns The updated incident
     */
    async closeIncident(incidentId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident)
            throw new AppError_1.AppError('Incident not found.', 404);
        if (incident.status !== 'UNDER_REVIEW') {
            throw new AppError_1.AppError(`Cannot close incident. Current status is ${incident.status}, but expected UNDER_REVIEW.`, 409);
        }
        return await incident_repository_1.incidentRepository.closeIncident(incidentId);
    }
    /**
     * Get incidents assigned to investigator
     */
    async getAssignedIncidents(investigatorId) {
        if (!investigatorId) {
            throw new Error('Invalid investigator ID');
        }
        return await incident_repository_1.incidentRepository.findAssignedIncidents(investigatorId);
    }
    /**
   * Get incidents assigned to the logged-in Action Owner
   * Only returns incidents with PENDING_ACTION status
   */
    async getActionOwnerIncidents(actionOwnerId) {
        if (!actionOwnerId || actionOwnerId <= 0) {
            throw new AppError_1.AppError('Invalid Action Owner ID.', 400);
        }
        return await incident_repository_1.incidentRepository.findActionOwnerIncidents(actionOwnerId);
    }
    /**
   * Submit corrective action for an incident
   * Changes status from PENDING_ACTION to UNDER_REVIEW
   */
    async submitCorrectiveAction(incidentId, actionOwnerId, correctiveAction) {
        if (!incidentId || incidentId <= 0) {
            throw new AppError_1.AppError('Invalid incident ID.', 400);
        }
        if (!actionOwnerId || actionOwnerId <= 0) {
            throw new AppError_1.AppError('Invalid Action Owner ID.', 400);
        }
        // Validate corrective action
        if (!correctiveAction || correctiveAction.trim().length < 20) {
            throw new AppError_1.AppError('Corrective action must be at least 20 characters long.', 400);
        }
        // Find the incident
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new AppError_1.AppError('Incident not found.', 404);
        }
        // Make sure this incident belongs to the logged-in Action Owner
        if (incident.actionOwnerId !== actionOwnerId) {
            throw new AppError_1.AppError('You are not authorized to submit a corrective action for this incident.', 403);
        }
        // Business rule: incident must be PENDING_ACTION
        if (incident.status !== 'PENDING_ACTION') {
            throw new AppError_1.AppError(`Cannot submit corrective action. Current status is ${incident.status}, but expected PENDING_ACTION.`, 409);
        }
        // Save corrective action and change status to UNDER_REVIEW
        return await incident_repository_1.incidentRepository.updateCorrectiveAction(incidentId, correctiveAction.trim());
    }
    /**
     * Submit Root Cause Analysis findings
     * @param incidentId - Incident ID
     * @param rootCause - RCA explanation
     * @param rootCauseCategory - RCA category
     */
    async submitRootCause(incidentId, rootCause, rootCauseCategory) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new Error('Incident not found.');
        }
        if (incident.status !== 'INVESTIGATING') {
            throw new Error(`Cannot submit root cause. Current status is ${incident.status}.`);
        }
        const updatedIncident = await incident_repository_1.incidentRepository.updateRootCause(incidentId, rootCause, rootCauseCategory);
        return updatedIncident;
    }
}
exports.IncidentService = IncidentService;
// Export a single instance of the service (Singleton pattern)
exports.incidentService = new IncidentService();
