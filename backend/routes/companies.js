const express = require('express');
const router = express.Router();
const {
  registerCompany,
  getCompanies,
  getCompany,
  updateCompany,
  getMyCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfile } = require('../config/cloudinary');

router.get('/', getCompanies);
router.get('/my', protect, authorize('recruiter'), getMyCompany);
router.get('/:id', getCompany);
router.post('/', protect, authorize('recruiter'), registerCompany);
router.put('/:id', protect, authorize('recruiter', 'admin'), uploadProfile.single('logo'), updateCompany);

module.exports = router;