const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeIntelligenceController');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);
router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;
