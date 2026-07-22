"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignActionOwnerSchema = exports.assignInvestigatorSchema = exports.rejectIncidentSchema = exports.incidentSchema = void 0;
const zod_1 = require("zod");
exports.incidentSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, "Title must be at least 5 characters"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters"),
    severity: zod_1.z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]),
    category: zod_1.z
        .string()
        .min(2, "Category is required"),
    location: zod_1.z
        .string()
        .min(2, "Location is required"),
    departmentId: zod_1.z.coerce.number()
});
// 1. Reject Incident Schema
exports.rejectIncidentSchema = zod_1.z.object({
    body: zod_1.z.object({
        reason: zod_1.z.string()
            .min(10, "Rejection reason must be at least 10 characters long.")
            .max(500, "Rejection reason cannot exceed 500 characters.")
            .trim(),
    }),
});
// 2. Assign Investigator Schema
exports.assignInvestigatorSchema = zod_1.z.object({
    body: zod_1.z.object({
        investigatorId: zod_1.z.number()
            .int("Investigator ID must be an integer.")
            .positive("Investigator ID must be a positive number."),
    }),
});
// 3. Assign Action Owner Schema
exports.assignActionOwnerSchema = zod_1.z.object({
    body: zod_1.z.object({
        actionOwnerId: zod_1.z.number()
            .int("Action Owner ID must be an integer.")
            .positive("Action Owner ID must be a positive number."),
    }),
});
