import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// Routes
router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);
router.get('/:id/task-count', userController.getUserTaskCount);

export default router;