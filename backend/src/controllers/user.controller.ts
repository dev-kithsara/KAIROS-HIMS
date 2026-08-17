import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';

// Route: GET /api/users/role/:role
// Description: List all users with a given role (e.g. INVESTIGATOR, ACTION_OWNER)
// Access: MANAGER / ADMIN
export const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = String(req.params.role || '');

    if (!role) {
      return next(new AppError('Role is required.', 400));
    }

    const users = await prisma.user.findMany({
      where: { role: role.toUpperCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.status(200).json({
      success: true,
      message: `Users with role ${role.toUpperCase()} fetched successfully.`,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};
