import { Router } from 'express';
import { getAllDepartments } from './departments.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllDepartments);

export default router;