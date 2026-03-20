// import express from 'express';
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { authMiddleware } = require('../middleware/auth');

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// router.get('/me', authMiddleware, authController.getCurrentUser);

// module.exports = router;

import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;