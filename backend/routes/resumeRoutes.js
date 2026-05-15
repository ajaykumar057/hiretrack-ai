const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getResumes, uploadResume, deleteResume, setDefaultResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);

router.route('/')
  .get(getResumes)
  .post(upload.single('resume'), uploadResume);

router.route('/:id')
  .delete(deleteResume);

router.put('/:id/default', setDefaultResume);

module.exports = router;
