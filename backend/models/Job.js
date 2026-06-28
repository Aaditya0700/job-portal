const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'],
      default: 'Entry Level',
    },
    skills: [{ type: String }],
    openings: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);