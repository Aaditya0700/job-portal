const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid website URL'],
    },
    location: {
      type: String,
    },
    logo: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    industry: {
      type: String,
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);