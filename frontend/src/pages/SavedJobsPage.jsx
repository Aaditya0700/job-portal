import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';

export default function SavedJobsPage() {
  const { user, updateUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setSavedJobs(data.user.savedJobs || []);
    } catch {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      const { data } = await API.put(`/jobs/${jobId}/save`);
      updateUser({ savedJobs: data.savedJobs });
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to remove job');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <BookmarkCheck className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-500 text-sm">{savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="text-lg font-semibold text-gray-900">No saved jobs yet</h3>
          <p className="text-gray-500 mt-2">Browse jobs and click the bookmark icon to save them here</p>
          <Link to="/jobs" className="btn-primary mt-4 inline-block">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSave={handleUnsave}
              isSaved={true}
              showSave={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}