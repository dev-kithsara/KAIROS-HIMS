import { Request, Response } from "express";
import { ZodError } from "zod";
import { incidentSchema } from "../validators/incident.validator";
import { createIncidentService } from "../services/incident.service";

export const createIncident = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = incidentSchema.parse(req.body);

   const incident = await createIncidentService(
    validatedData,
    req.files as Express.Multer.File[]
);

    return res.status(201).json({
      success: true,
      message: "Incident created successfully",
      incident,
    });

  } catch (error) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

   console.error(error);

return res.status(500).json({
  success: false,
  message: "Internal Server Error",
  error: error
})
  }
};