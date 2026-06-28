import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Briefcase, Clock, CheckCircle2, XCircle, AlertCircle,
  Eye, Trash2, Loader2, TrendingUp, BookmarkCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', Icon: Clock },
  reviewing: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', Icon: Eye },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700', Icon: TrendingUp },
  hired: { label: 'Hired 🎉', color: 'bg-green-100 text-green-700', Icon: CheckCircle2 },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-700', Icon: XCircle },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my');
      setApplications(data.applications);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await API.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      toast.success('Application withdrawn');
    } catch {
      toast.error('Failed to withdraw');
    } finally {
      setWithdrawing(null);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    hired: applications.filter((a) => a.status === 'hired').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Track your job applications and career progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-purple-600' },
          { label: 'Hired', value: stats.hired, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/jobs" className="card hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Browse Jobs</p>
            <p className="text-xs text-gray-500">Find new opportunities</p>
          </div>
        </Link>
        <Link to="/saved-jobs" className="card hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <BookmarkCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Saved Jobs</p>
            <p className="text-xs text-gray-500">{user?.savedJobs?.length || 0} saved</p>
          </div>
        </Link>
        <Link to="/profile" className="card hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Update Profile</p>
            <p className="text-xs text-gray-500">
              {user?.profile?.resumeUrl ? 'Resume uploaded ✓' : 'Upload resume'}
            </p>
          </div>
        </Link>
      </div>

      {/* Applications List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Applications</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn-primary mt-4 inline-block">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const StatusIcon = config.Icon;
              return (
                <div key={app._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {app.job?.company?.logo ? (
                        <img src={app.job.company.logo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/jobs/${app.job?._id}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors truncate block">
                        {app.job?.title || 'Job Deleted'}
                      </Link>
                      <p className="text-sm text-gray-500">{app.job?.company?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge ${config.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        disabled={withdrawing === app._id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Withdraw"
                      >
                        {withdrawing === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}