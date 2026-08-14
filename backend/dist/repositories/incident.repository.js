"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidentRepository = exports.IncidentRepository = void 0;
const client_1 = require("@prisma/client");
// Note: In a real enterprise app, we usually import a single Prisma instance from a config file.
// For now, we instantiate it here. Later we will refactor this to use Dependency Injection.
const prisma = new client_1.PrismaClient();
class IncidentRepository {
    /**
     * Fetch all incidents belonging to a specific department
     * @param departmentId - The ID of the department
     * @returns Array of incidents with reporter details
     */
    async findByDepartmentId(departmentId) {
        return await prisma.incident.findMany({
            where: {
                departmentId: departmentId,
            },
            // We use 'include' to perform a SQL JOIN and get related data
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                investigator: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                actionOwner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            // Sort by newest first
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    /**
     * Find a single incident by its ID
     * @param id - The ID of the incident
     * @returns The incident object or null if not found
     */
    async findById(id) {
        return await prisma.incident.findUnique({
            where: { id: id },
        });
    }
    /**
     * Find a single incident by its ID with related data
     * (reporter, department, investigator, action owner, attachments)
     * @param id - The ID of the incident
     * @returns The incident with relations, or null if not found
     */
    async findByIdWithRelations(id) {
        return await prisma.incident.findUnique({
            where: { id: id },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                investigator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                actionOwner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                attachments: true,
            },
        });
    }
    /**
     * Update the status of an incident
     * @param id - The ID of the incident
     * @param status - The new status (e.g., ACCEPTED)
     * @returns The updated incident
     */
    async updateStatus(id, status) {
        // Note: 'any' is used temporarily for status. We will use the proper Prisma Enum type later.
        return await prisma.incident.update({
            where: { id: id },
            data: { status: status },
        });
    }
    /**
     * Reject an incident and save the reason
     * @param id - The ID of the incident
     * @param reason - The reason for rejection
     * @returns The updated incident
     */
    async rejectIncident(id, reason) {
        return await prisma.incident.update({
            where: { id: id },
            data: {
                status: 'REJECTED',
                rejectionReason: reason
            },
        });
    }
    /**
     * Assign an investigator to an incident and update status to INVESTIGATING
     * @param id - The ID of the incident
     * @param investigatorId - The ID of the user assigned to investigate
     * @returns The updated incident
     */
    async assignInvestigator(id, investigatorId) {
        return await prisma.incident.update({
            where: { id: id },
            data: {
                status: 'INVESTIGATING',
                investigatorId: investigatorId
            },
        });
    }
    /**
     * Assign Action Owner
     * @param id - The ID of the incident
     * @param actionOwnerId - The ID of the user assigned to own the action
     * @returns The updated incident
     */
    async assignActionOwner(id, actionOwnerId) {
        return await prisma.incident.update({
            where: { id: id },
            data: {
                status: 'PENDING_ACTION',
                actionOwnerId: actionOwnerId
            }
        });
    }
    /**
     * Mark an incident as UNDER_REVIEW
     * @param id - The ID of the incident
     * @returns The updated incident
     */
    async reviewIncident(id) {
        return await prisma.incident.update({
            where: { id: id },
            data: {
                status: 'UNDER_REVIEW',
            },
        });
    }
    /**
     * Close the incident
     * @param id - The ID of the incident
     * @returns The updated incident
     */
    async closeIncident(id) {
        return await prisma.incident.update({
            where: { id: id },
            data: {
                status: 'CLOSED',
            },
        });
    }
    /**
   * Get incidents assigned to an investigator
   * Only returns incidents with INVESTIGATING status
   */
    async findAssignedIncidents(investigatorId) {
        return await prisma.incident.findMany({
            where: {
                investigatorId: investigatorId,
                status: "INVESTIGATING",
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                attachments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Update Root Cause Analysis findings
     * @param id - Incident ID
     * @param rootCause - Investigator findings
     * @param rootCauseCategory - Category of root cause
     */
    async updateRootCause(id, rootCause, rootCauseCategory) {
        return await prisma.incident.update({
            where: {
                id: id,
            },
            data: {
                rootCause: rootCause,
                rootCauseCategory: rootCauseCategory,
            },
        });
    }
    /**
     * Get incidents assigned to an Action Owner
     * Only returns incidents with PENDING_ACTION status
     */
    async findActionOwnerIncidents(actionOwnerId) {
        return await prisma.incident.findMany({
            where: {
                actionOwnerId: actionOwnerId,
                status: "PENDING_ACTION",
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                investigator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                attachments: true,
                actionOwner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Save corrective action and move incident to UNDER_REVIEW
     */
    async updateCorrectiveAction(id, correctiveAction) {
        return await prisma.incident.update({
            where: {
                id: id,
            },
            data: {
                correctiveAction: correctiveAction,
                status: "UNDER_REVIEW",
            },
        });
    }
}
exports.IncidentRepository = IncidentRepository;
exports.incidentRepository = new IncidentRepository();
