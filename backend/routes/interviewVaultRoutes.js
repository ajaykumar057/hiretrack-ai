const express = require('express');
const router = express.Router();
const { getExperiences, createExperience, updateExperience, deleteExperience, generateQuestions } = require('../controllers/interviewVaultController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate-questions', generateQuestions);
router.route('/').get(getExperiences).post(createExperience);
router.route('/:id').put(updateExperience).delete(deleteExperience);

module.exports = router;
