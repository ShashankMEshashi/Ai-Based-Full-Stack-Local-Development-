const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/sentiment', authMiddleware, aiController.analyzeSentiment);
router.post('/summarize', authMiddleware, aiController.summarizeText);
router.post('/skill-match', authMiddleware, aiController.matchSkills);

module.exports = router;
