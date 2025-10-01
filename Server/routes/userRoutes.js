const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// User management routes
router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);
router.get('/:id/task-count', userController.getUserTaskCount);

module.exports = router;
