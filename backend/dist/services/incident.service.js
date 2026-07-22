"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidentService = exports.IncidentService = exports.createIncidentService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const incident_repository_1 = require("../repositories/incident.repository");
/**
 * Service function for creating an incident (Staff Submission + Attachments)
 */
const createIncidentService = async (data, files) => {
    const incident = await prisma_1.default.incident.create({
        data: {
            title: data.title,
            description: data.description,
            severity: data.severity,
            category: data.category,
            location: data.location,
            status: "OPEN",
            departmentId: Number(data.departmentId),
            reporterId: data.reporterId ? Number(data.reporterId) : 2,
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
     * Get all incidents for a specific department
     * @param departmentId - The ID of the manager's department
     * @returns Array of incidents
     */
    async getIncidentsByDepartment(departmentId) {
        if (!departmentId || departmentId <= 0) {
            throw new Error("Invalid Department ID provided");
        }
        const incidents = await incident_repository_1.incidentRepository.findByDepartmentId(departmentId);
        return incidents;
    }
    /**
     * Accept an OPEN incident
     * @param incidentId - The ID of the incident to accept
     * @returns The updated incident
     */
    async acceptIncident(incidentId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident) {
            throw new Error("Incident not found.");
        }
        if (incident.status !== "OPEN") {
            throw new Error(`Cannot accept incident. Current status is ${incident.status}, but expected OPEN.`);
        }
        const updatedIncident = await incident_repository_1.incidentRepository.updateStatus(incidentId, "ACCEPTED");
        return updatedIncident;
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
            throw new Error("Incident not found.");
        }
        if (incident.status !== "OPEN") {
            throw new Error(`Cannot reject incident. Current status is ${incident.status}, but expected OPEN.`);
        }
        const updatedIncident = await incident_repository_1.incidentRepository.rejectIncident(incidentId, reason);
        return updatedIncident;
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
            throw new Error("Incident not found.");
        }
        if (incident.status !== "ACCEPTED") {
            throw new Error(`Cannot assign investigator. Current status is ${incident.status}, but expected ACCEPTED.`);
        }
        const investigator = await prisma_1.default.user.findUnique({
            where: { id: investigatorId },
        });
        if (!investigator) {
            throw new Error("The specified investigator does not exist.");
        }
        if (investigator.role !== "INVESTIGATOR" && investigator.role !== "MANAGER") {
            throw new Error("The specified user does not have the required role to be an investigator.");
        }
        const updatedIncident = await incident_repository_1.incidentRepository.assignInvestigator(incidentId, investigatorId);
        return updatedIncident;
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
            throw new Error("Incident not found.");
        }
        if (incident.status !== "INVESTIGATING") {
            throw new Error(`Cannot assign action owner. Current status is ${incident.status}, but expected INVESTIGATING.`);
        }
        const actionOwner = await prisma_1.default.user.findUnique({
            where: { id: actionOwnerId },
        });
        if (!actionOwner) {
            throw new Error("The specified action owner does not exist.");
        }
        if (actionOwner.role !== "ACTION_OWNER" && actionOwner.role !== "MANAGER") {
            throw new Error("The specified user does not have the required role to be an action owner.");
        }
        const updatedIncident = await incident_repository_1.incidentRepository.assignActionOwner(incidentId, actionOwnerId);
        return updatedIncident;
    }
    /**
     * Mark an incident as UNDER_REVIEW
     * @param incidentId - The ID of the incident
     * @returns The updated incident
     */
    async reviewIncident(incidentId) {
        const incident = await incident_repository_1.incidentRepository.findById(incidentId);
        if (!incident)
            throw new Error("Incident not found.");
        if (incident.status !== "PENDING_ACTION") {
            throw new Error(`Cannot review incident. Current status is ${incident.status}, but expected PENDING_ACTION.`);
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
            throw new Error("Incident not found.");
        if (incident.status !== "UNDER_REVIEW") {
            throw new Error(`Cannot close incident. Current status is ${incident.status}, but expected UNDER_REVIEW.`);
        }
        return await incident_repository_1.incidentRepository.closeIncident(incidentId);
    }
}
exports.IncidentService = IncidentService;
// Export a single instance of the service (Singleton pattern)
exports.incidentService = new IncidentService();
