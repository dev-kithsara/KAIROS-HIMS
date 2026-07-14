import { z } from 'zod';

// Define the schema for rejecting an incident
export const rejectIncidentSchema = z.object({
  body: z.object({
    reason: z
      .string({
        required_error: "Rejection reason is required.",
        invalid_type_error: "Rejection reason must be a string.",
      })
      .min(10, "Rejection reason must be at least 10 characters long.")
      .max(500, "Rejection reason cannot exceed 500 characters.")
      .trim(),
  }),
});

// Define the schema for assigning an investigator to an incident
export const assignInvestigatorSchema = z.object({
  body: z.object({
    investigatorId: z
      .number({
        required_error: "Investigator ID is required.",
        invalid_type_error: "Investigator ID must be a number.",
      })
      .int("Investigator ID must be an integer.")
      .positive("Investigator ID must be a positive number."),
  }),
});

// We can infer the TypeScript type directly from the Zod schema
// This is useful if we need to pass this data around in our code
export type RejectIncidentInput = z.infer<typeof rejectIncidentSchema>['body'];
export type AssignInvestigatorInput = z.infer<typeof assignInvestigatorSchema>['body'];