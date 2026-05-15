const express = require('express');
const router = express.Router();
const { getApplications, createApplication, updateApplication, deleteApplication, getAnalytics, getHeatmapData, importLinkedInJob } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/analytics', getAnalytics);
router.get('/heatmap', getHeatmapData);
router.post('/import-linkedin', importLinkedInJob);
router.route('/').get(getApplications).post(createApplication);
router.route('/:id').put(updateApplication).delete(deleteApplication);

module.exports = router;
