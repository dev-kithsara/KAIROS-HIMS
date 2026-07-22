import { z } from "zod";

export const incidentSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  severity: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),

  category: z
    .string()
    .min(2, "Category is required"),

  location: z
    .string()
    .min(2, "Location is required"),

  departmentId: z.coerce.number()
});