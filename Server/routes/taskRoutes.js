import express from 'express';
const router = express.Router();
import taskController from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

router.use(authMiddleware);

// Task routes
router.get('/stats', taskController.getTaskStats); 
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
