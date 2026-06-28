const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleSaveJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.put('/:id/save', protect, authorize('student'), toggleSaveJob);

module.exports = router;