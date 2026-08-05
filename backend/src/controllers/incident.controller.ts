// backend/src/controllers/incident.controller.ts

import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import {
  incidentSchema,
  rejectIncidentSchema,
  assignInvestigatorSchema,
  assignActionOwnerSchema,
} from '../validators/incident.validator';
import { incidentService, createIncidentService } from '../services/incident.service';
import { AppError } from '../utils/AppError'; // Import the custom error class

export const createIncident = async (req: Request, res: Response) => {
  try {
    const validatedData = incidentSchema.parse(req.body);
    const incident = await createIncidentService(validatedData, req.files as Express.Multer.File[]);
    return res
      .status(201)
      .json({ success: true, message: 'Incident created successfully', incident });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    // Check for our custom AppError
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error('Error creating incident:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

export const getDepartmentIncidents = async (req: Request, res: Response) => {
  try {
    const departmentId = parseInt(req.params.departmentId as string, 10);
    if (isNaN(departmentId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid department ID provided in the URL.' });
    }
    const incidents = await incidentService.getIncidentsByDepartment(departmentId);
    return res.status(200).json({ success: true, data: incidents });
  } catch (error: any) {
    // FIX FOR BUG-01: Catch AppError and return its specific status code
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'An unexpected error occurred.' });
  }
};

export const acceptIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.acceptIncident(incidentId);
    return res
      .status(200)
      .json({ success: true, message: 'Incident accepted successfully.', data: updatedIncident });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to accept incident.' });
  }
};

export const rejectIncident = async (req: Request, res: Response) => {
  try {
    const validatedData = rejectIncidentSchema.parse({ body: req.body });
    const reason = validatedData.body.reason;
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.rejectIncident(incidentId, reason);
    return res
      .status(200)
      .json({ success: true, message: 'Incident rejected successfully.', data: updatedIncident });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues?.map((e) => e.message),
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to reject incident.' });
  }
};

export const assignInvestigator = async (req: Request, res: Response) => {
  try {
    const validatedData = assignInvestigatorSchema.parse({ body: req.body });
    const investigatorId = validatedData.body.investigatorId;
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.assignInvestigator(incidentId, investigatorId);
    return res.status(200).json({
      success: true,
      message: 'Investigator assigned successfully.',
      data: updatedIncident,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues?.map((e) => e.message),
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to assign investigator.' });
  }
};

export const assignActionOwner = async (req: Request, res: Response) => {
  try {
    const validatedData = assignActionOwnerSchema.parse({ body: req.body });
    const actionOwnerId = validatedData.body.actionOwnerId;
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.assignActionOwner(incidentId, actionOwnerId);
    return res.status(200).json({
      success: true,
      message: 'Action owner assigned successfully.',
      data: updatedIncident,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues?.map((e) => e.message),
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to assign action owner.' });
  }
};

export const reviewIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.reviewIncident(incidentId);
    return res
      .status(200)
      .json({ success: true, message: 'Incident marked as UNDER_REVIEW.', data: updatedIncident });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to review incident.' });
  }
};

export const closeIncident = async (req: Request, res: Response) => {
  try {
    const incidentId = parseInt(req.params.id as string, 10);
    if (isNaN(incidentId)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID provided.' });
    }
    const updatedIncident = await incidentService.closeIncident(incidentId);
    return res
      .status(200)
      .json({ success: true, message: 'Incident closed successfully.', data: updatedIncident });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Failed to close incident.' });
  }
};
