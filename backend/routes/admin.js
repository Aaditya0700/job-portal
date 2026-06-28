const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);

module.exports = router;