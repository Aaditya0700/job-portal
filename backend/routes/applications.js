const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:jobId', protect, authorize('student'), applyForJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('student'), withdrawApplication);

module.exports = router;