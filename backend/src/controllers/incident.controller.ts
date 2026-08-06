// backend/src/controllers/incident.controller.ts

import { Request, Response } from 'express';
import {
  incidentSchema,
  rejectIncidentSchema,
  assignInvestigatorSchema,
  assignActionOwnerSchema,
} from '../validators/incident.validator';
import { incidentService, createIncidentService } from '../services/incident.service';
import { catchAsync } from '../utils/catchAsync'; // Import our magic wrapper
import { AppError } from '../utils/AppError';

/**
 * Controller for creating a new incident report
 * Wrapped in catchAsync to automatically handle errors
 */
export const createIncident = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate input. If it fails, Zod throws an error, catchAsync catches it!
  const validatedData = incidentSchema.parse(req.body);

  // FIX FOR BUG-01: Security Check
  // We MUST ensure the user is authenticated before creating an incident.
  // The 'authenticate' middleware should have populated req.user.
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // OVERRIDE the reporterId with the securely verified ID from the JWT token.
  // This prevents malicious users from submitting incidents on behalf of others.
  const incidentData = {
    ...validatedData,
    reporterId: req.user.id,
  };

  // 2. Call service
  const incident = await createIncidentService(incidentData, req.files as Express.Multer.File[]);

  // 3. Send response
  return res.status(201).json({
    success: true,
    message: 'Incident created successfully',
    incident,
  });
});

export const getDepartmentIncidents = catchAsync(async (req: Request, res: Response) => {
  const departmentId = parseInt(req.params.departmentId as string, 10);
  // We can throw normal errors here, catchAsync will pass them to the global handler
  if (isNaN(departmentId)) throw new AppError('Invalid department ID provided in the URL.', 400);

  const incidents = await incidentService.getIncidentsByDepartment(departmentId);
  return res.status(200).json({ success: true, data: incidents });
});

export const acceptIncident = catchAsync(async (req: Request, res: Response) => {
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.acceptIncident(incidentId);
  return res
    .status(200)
    .json({ success: true, message: 'Incident accepted.', data: updatedIncident });
});

export const rejectIncident = catchAsync(async (req: Request, res: Response) => {
  const validatedData = rejectIncidentSchema.parse({ body: req.body });
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.rejectIncident(
    incidentId,
    validatedData.body.reason
  );
  return res
    .status(200)
    .json({ success: true, message: 'Incident rejected.', data: updatedIncident });
});

export const assignInvestigator = catchAsync(async (req: Request, res: Response) => {
  const validatedData = assignInvestigatorSchema.parse({ body: req.body });
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.assignInvestigator(
    incidentId,
    validatedData.body.investigatorId
  );
  return res
    .status(200)
    .json({ success: true, message: 'Investigator assigned.', data: updatedIncident });
});

export const assignActionOwner = catchAsync(async (req: Request, res: Response) => {
  const validatedData = assignActionOwnerSchema.parse({ body: req.body });
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.assignActionOwner(
    incidentId,
    validatedData.body.actionOwnerId
  );
  return res
    .status(200)
    .json({ success: true, message: 'Action owner assigned.', data: updatedIncident });
});

export const reviewIncident = catchAsync(async (req: Request, res: Response) => {
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.reviewIncident(incidentId);
  return res
    .status(200)
    .json({ success: true, message: 'Incident marked as UNDER_REVIEW.', data: updatedIncident });
});

export const closeIncident = catchAsync(async (req: Request, res: Response) => {
  const incidentId = parseInt(req.params.id as string, 10);
  if (isNaN(incidentId)) throw new Error('Invalid incident ID provided.');

  const updatedIncident = await incidentService.closeIncident(incidentId);
  return res
    .status(200)
    .json({ success: true, message: 'Incident closed.', data: updatedIncident });
});
