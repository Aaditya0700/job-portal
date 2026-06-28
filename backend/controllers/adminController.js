const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalCompanies, recentUsers, recentJobs] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        Company.countDocuments(),
        User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
        Job.find().sort('-createdAt').limit(5).populate('company', 'name'),
      ]);

    const studentCount = await User.countDocuments({ role: 'student' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const activeJobs = await Job.countDocuments({ status: 'active' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        studentCount,
        recruiterCount,
        activeJobs,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Application.deleteMany({ applicant: req.params.id });
    await user.deleteOne();

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Private (admin)
const getAllJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name')
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, jobs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus, deleteUser, getAllJobs };