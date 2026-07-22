import { Request, Response } from "express";
import { z, ZodError } from "zod";
import {
  incidentSchema,
  rejectIncidentSchema,
  assignInvestigatorSchema,
  assignActionOwnerSchema,
} from "../validators/incident.validator";
import { incidentService, createIncidentService } from "../services/incident.service";

/**
 * Controller for creating a new incident report (Staff submission + attachments)
 */
export const createIncident = async (req: Request, res: Response) => {
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

    console.error("Error creating incident:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/**
 * Get all incidents for a specific department
 */
export const getDepartmentIncidents = async (req: Request, res: Response) => {
  try {
    const departmentId = parseInt(req.params.departmentId as string, 10);

    if (isNaN(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID provided in the URL.",
      });
    }

    const incidents = await incidentService.getIncidentsByDepartment(departmentId);

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred on the server.",
    });
  }
};

/**
 * Accept an OPEN incident
 */
export const acceptIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);

    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    const updatedIncident = await incidentService.acceptIncident(incidentId);

    return res.status(200).json({
      success: true,
      message: "Incident accepted successfully.",
      data: updatedIncident,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to accept incident.",
    });
  }
};

/**
 * Reject an OPEN incident with a reason
 */
export const rejectIncident = async (req: Request, res: Response) => {
  try {
    const validatedData = rejectIncidentSchema.parse({ body: req.body });
    const reason = validatedData.body.reason;

    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    const updatedIncident = await incidentService.rejectIncident(incidentId, reason);

    return res.status(200).json({
      success: true,
      message: "Incident rejected successfully.",
      data: updatedIncident,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
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

/**
 * Assign an investigator to an ACCEPTED incident
 */
export const assignInvestigator = async (req: Request, res: Response) => {
  try {
    const validatedData = assignInvestigatorSchema.parse({ body: req.body });
    const investigatorId = validatedData.body.investigatorId;

    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    const updatedIncident = await incidentService.assignInvestigator(incidentId, investigatorId);

    return res.status(200).json({
      success: true,
      message: "Investigator assigned successfully.",
      data: updatedIncident,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
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

/**
 * Assign an action owner to an INVESTIGATING incident
 */
export const assignActionOwner = async (req: Request, res: Response) => {
  try {
    const validatedData = assignActionOwnerSchema.parse({ body: req.body });
    const actionOwnerId = validatedData.body.actionOwnerId;

    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    const updatedIncident = await incidentService.assignActionOwner(incidentId, actionOwnerId);

    return res.status(200).json({
      success: true,
      message: "Action owner assigned successfully.",
      data: updatedIncident,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
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

/**
 * Mark an incident as UNDER_REVIEW
 */
export const reviewIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: "Invalid incident ID provided." });
    }

    const updatedIncident = await incidentService.reviewIncident(incidentId);

    return res.status(200).json({
      success: true,
      message: "Incident marked as UNDER_REVIEW.",
      data: updatedIncident,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to review incident.",
    });
  }
};

/**
 * Close the incident
 */
export const closeIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: "Invalid incident ID provided." });
    }

    const updatedIncident = await incidentService.closeIncident(incidentId);

    return res.status(200).json({
      success: true,
      message: "Incident closed successfully.",
      data: updatedIncident,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to close incident.",
    });
  }
};