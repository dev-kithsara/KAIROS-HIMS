import { z } from 'zod';

// 1. Reject Incident Schema
export const rejectIncidentSchema = z.object({
  body: z.object({
    // Removed the custom object, using standard chaining
    reason: z.string()
      .min(10, "Rejection reason must be at least 10 characters long.")
      .max(500, "Rejection reason cannot exceed 500 characters.")
      .trim(),
  }),
});

export type RejectIncidentInput = z.infer<typeof rejectIncidentSchema>['body'];

// 2. Assign Investigator Schema
export const assignInvestigatorSchema = z.object({
  body: z.object({
    investigatorId: z.number()
      .int("Investigator ID must be an integer.")
      .positive("Investigator ID must be a positive number."),
  }),
});

export type AssignInvestigatorInput = z.infer<typeof assignInvestigatorSchema>['body'];

// 3. Assign Action Owner Schema
export const assignActionOwnerSchema = z.object({
  body: z.object({
    actionOwnerId: z.number()
      .int("Action Owner ID must be an integer.")
      .positive("Action Owner ID must be a positive number."),
  }),
});

export type AssignActionOwnerInput = z.infer<typeof assignActionOwnerSchema>['body'];