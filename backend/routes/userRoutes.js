const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/history', authMiddleware, userController.getUserHistory);
router.delete('/history/:id', authMiddleware, userController.deleteHistoryItem);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
