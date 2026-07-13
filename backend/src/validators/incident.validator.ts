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

// We can infer the TypeScript type directly from the Zod schema
// This is useful if we need to pass this data around in our code
export type RejectIncidentInput = z.infer<typeof rejectIncidentSchema>['body'];