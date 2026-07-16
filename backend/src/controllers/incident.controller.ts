import { Request, Response } from 'express';
import { incidentService } from '../services/incident.service';
import { z } from 'zod';
import { rejectIncidentSchema , assignInvestigatorSchema , assignActionOwnerSchema } from '../validators/incident.validator';

export const getDepartmentIncidents = async (req: Request, res: Response) => {
  try {
    // 1. Extracting data from the Request
    // Note: In a real app, this will come from the logged-in manager's JWT token (req.user.departmentId)
    // For now, to test this easily, we take it from the URL parameter (e.g., /api/incidents/department/2)
    const departmentId = parseInt(req.params.departmentId as string, 10);

    // 2. Input Validation (Basic)
    if (isNaN(departmentId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid department ID provided in the URL." 
      });
    }

    // 3. Calling the Service Layer
    const incidents = await incidentService.getIncidentsByDepartment(departmentId);

    // 4. Sending the HTTP Response back to the client
    return res.status(200).json({
      success: true,
      data: incidents,
    });

  } catch (error: any) {
    // 5. Global Error Handling for this endpoint
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred on the server.",
    });
  }
};


export const acceptIncident = async (req: Request, res: Response) => {
  try {
    // 1. Extract the incident ID from the URL parameters
    const incidentId = parseInt(req.params.id as string, 10);

    // 2. Validate the ID
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    // 3. Call the Service Layer to perform the business logic
    const updatedIncident = await incidentService.acceptIncident(incidentId);

    // 4. Send the successful response
    return res.status(200).json({
      success: true,
      message: "Incident accepted successfully.",
      data: updatedIncident,
    });

  } catch (error: any) {
    // 5. Error Handling
    // Note: Currently all errors return 500. We will improve this later to return 400 for business logic errors.
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to accept incident.",
    });
  }
};

export const rejectIncident = async (req: Request, res: Response) => {
  try {
    // 1. Validate the Request Body using Zod
    // If validation fails, this will throw an error and go straight to the catch block
    const validatedData = rejectIncidentSchema.parse({ body: req.body });
    const reason = validatedData.body.reason;

    // 2. Extract and validate Incident ID
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    // 3. Call the Service Layer
    const updatedIncident = await incidentService.rejectIncident(incidentId, reason);

    // 4. Send the successful response
    return res.status(200).json({
      success: true,
      message: "Incident rejected successfully.",
      data: updatedIncident,
    });

  } catch (error: any) {
    // 5. Error Handling
    
    // Check if the error is a Zod Validation Error
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        // FIX: Changed error.errors to error.issues
        errors: error.issues?.map(e => e.message) || ["Invalid input data"], 
      });
    }

    // Handle other server/business logic errors
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject incident.",
    });
  }
};

export const assignInvestigator = async (req: Request, res: Response) => {
  try {
    // 1. Validate the Request Body using Zod
    const validatedData = assignInvestigatorSchema.parse({ body: req.body });
    const investigatorId = validatedData.body.investigatorId;

    // 2. Extract and validate Incident ID from URL
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    // 3. Call the Service Layer
    const updatedIncident = await incidentService.assignInvestigator(incidentId, investigatorId);

    // 4. Send the successful response
    return res.status(200).json({
      success: true,
      message: "Investigator assigned successfully.",
      data: updatedIncident,
    });

  } catch (error: any) {
    // 5. Error Handling
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues?.map(e => e.message) || ["Invalid input data"],
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to assign investigator.",
    });
  }
};

export const assignActionOwner = async (req: Request, res: Response) => {
  try {
    // 1. Validate the Request Body using Zod
    const validatedData = assignActionOwnerSchema.parse({ body: req.body });
    const actionOwnerId = validatedData.body.actionOwnerId;

    // 2. Extract and validate Incident ID from URL
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID provided.",
      });
    }

    // 3. Call the Service Layer
    const updatedIncident = await incidentService.assignActionOwner(incidentId, actionOwnerId);

    // 4. Send the successful response
    return res.status(200).json({
      success: true,
      message: "Action owner assigned successfully.",
      data: updatedIncident,
    });

  } catch (error: any) {
    // 5. Error Handling
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues?.map(e => e.message) || ["Invalid input data"],
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to assign action owner.",
    });
  }
};


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