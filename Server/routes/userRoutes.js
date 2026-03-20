import express from 'express';
const router = express.Router();
import userController from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);
router.get('/:id/task-count', userController.getUserTaskCount);

module.exports = router;
