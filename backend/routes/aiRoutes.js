const express = require('express');
const router = express.Router();
const { resumeMatchScore, getCareerInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/resume-match', resumeMatchScore);
router.get('/insights', getCareerInsights);

module.exports = router;
