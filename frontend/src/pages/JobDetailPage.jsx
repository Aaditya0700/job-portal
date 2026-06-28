import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  MapPin, Clock, Briefcase, DollarSign, Users, Building2,
  Globe, Bookmark, BookmarkCheck, Share2, ArrowLeft, Loader2, CheckCircle,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (user && job) {
      checkIfApplied();
    }
  }, [user, job]);

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data.job);
    } catch {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const { data } = await API.get('/applications/my');
      const hasApplied = data.applications.some((a) => a.job?._id === id);
      setApplied(hasApplied);
    } catch {}
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!user.profile?.resumeUrl) return toast.error('Please upload a resume first in your profile');

    setApplying(true);
    try {
      await API.post(`/applications/${id}`, { coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await API.put(`/jobs/${id}/save`);
      updateUser({ savedJobs: data.savedJobs });
      toast.success(data.saved ? 'Job saved!' : 'Removed from saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  );
  if (!job) return null;

  const isSaved = user?.savedJobs?.includes(id);
  const salaryText = job.salary?.min
    ? `₹${(job.salary.min / 100000).toFixed(1)}L${job.salary.max ? ` - ₹${(job.salary.max / 100000).toFixed(1)}L` : '+'}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600 font-medium mt-1">{job.company?.name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-primary-100 text-primary-700">{job.jobType}</span>
                  <span className="badge bg-gray-100 text-gray-600">{job.experienceLevel}</span>
                  {job.status === 'active' && <span className="badge bg-green-100 text-green-700">Actively Hiring</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
              </div>
              {salaryText && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{salaryText}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {user?.role === 'student' && (
                applied ? (
                  <div className="flex items-center gap-2 px-6 py-2.5 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                    <CheckCircle className="w-4 h-4" /> Applied
                  </div>
                ) : (
                  <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-primary px-6 py-2.5">
                    Apply Now
                  </button>
                )
              )}
              {!user && (
                <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2.5">
                  Login to Apply
                </button>
              )}
              {user?.role === 'student' && (
                <button onClick={handleSave} className="btn-secondary px-4 py-2.5 flex items-center gap-2">
                  {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary-600" /> : <Bookmark className="w-4 h-4" />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              )}
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="btn-secondary px-4 py-2.5"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Apply Form */}
            {showApplyForm && !applied && (
              <form onSubmit={handleApply} className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Write a Cover Letter (Optional)</h3>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the recruiter why you're a great fit for this role..."
                  rows={4}
                  className="input-field resize-none"
                />
                <div className="flex gap-3 mt-3">
                  <button type="submit" disabled={applying} className="btn-primary flex items-center gap-2">
                    {applying ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Job Overview */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Job Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Posted</span>
                <span className="font-medium">{format(new Date(job.createdAt), 'MMM d, yyyy')}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-medium">{format(new Date(job.deadline), 'MMM d, yyyy')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Applicants</span>
                <span className="font-medium">{job.applications?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Openings</span>
                <span className="font-medium">{job.openings}</span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">About the Company</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{job.company?.name}</p>
                {job.company?.industry && <p className="text-xs text-gray-500">{job.company.industry}</p>}
              </div>
            </div>
            {job.company?.description && (
              <p className="text-sm text-gray-500 line-clamp-3">{job.company.description}</p>
            )}
            {job.company?.website && (
              <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary-600 mt-3 hover:underline">
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            )}
            {job.company?.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <MapPin className="w-4 h-4" /> {job.company.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}