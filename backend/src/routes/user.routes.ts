import { Router } from 'express';
import { getUsersByRole } from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Route: GET /api/users/role/:role
// Description: List all users with a given role
// Access: MANAGER / ADMIN
router.get(
  '/role/:role',
  authenticate,
  authorizeRoles('MANAGER', 'ADMIN'),
  getUsersByRole
);

export default router;
