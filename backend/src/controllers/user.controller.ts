// backend/src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

// 1. Zod Schema to validate the incoming role change request
const changeRoleSchema = z.object({
  body: z.object({
    newRole: z.enum(['STAFF', 'INVESTIGATOR', 'ACTION_OWNER'], {
      errorMap: () => ({ message: 'Role must be STAFF, INVESTIGATOR, or ACTION_OWNER' }),
    }),
  }),
});

/**
 * Get all users in the manager's department
 */
export const getDepartmentUsers = catchAsync(async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user) throw new AppError('User not authenticated.', 401);

  // A manager can only see users in their own department
  const departmentId = req.user.departmentId;

  const users = await userService.getUsersByDepartment(departmentId);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Get all users with a specific role
 */
export const getUsersByRole = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('User not authenticated.', 401);

  const role = (req.params.role as string)?.toUpperCase();
  if (!role) throw new AppError('Role parameter is required.', 400);

  const users = await userService.getUsersByRole(role);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Change a user's role (Promote/Demote)
 */
export const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('User not authenticated.', 401);

  // 1. Validate the request body
  const validatedData = changeRoleSchema.parse({ body: req.body });
  const { newRole } = validatedData.body;

  // 2. Extract the target user ID from the URL
  const targetUserId = parseInt(req.params.id as string, 10);
  if (isNaN(targetUserId)) throw new AppError('Invalid user ID provided.', 400);

  // 3. Call the service layer with the Manager's details and the Target User's details
  const updatedUser = await userService.changeUserRole(
    req.user.id, // Manager's ID
    req.user.departmentId, // Manager's Department ID
    targetUserId, // The user being changed
    newRole // The new role
  );

  return res.status(200).json({
    success: true,
    message: `User role successfully updated to ${newRole}.`,
    data: updatedUser,
  });
});
