import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, SlidersHorizontal, X } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, current: 1 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: [],
    experienceLevel: [],
    minSalary: '',
    maxSalary: '',
  });

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.jobType.length) params.jobType = filters.jobType.join(',');
      if (filters.experienceLevel.length) params.experienceLevel = filters.experienceLevel.join(',');
      if (filters.minSalary) params.minSalary = filters.minSalary;
      if (filters.maxSalary) params.maxSalary = filters.maxSalary;

      const { data } = await API.get('/jobs', { params });
      setJobs(data.jobs);
      setPagination({ total: data.total, pages: data.pages, current: data.currentPage });
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleSaveJob = async (jobId) => {
    if (!user) return toast.error('Please log in to save jobs');
    if (user.role !== 'student') return;
    try {
      const { data } = await API.put(`/jobs/${jobId}/save`);
      updateUser({ savedJobs: data.savedJobs });
      toast.success(data.saved ? 'Job saved!' : 'Job removed from saved');
    } catch {
      toast.error('Failed to save job');
    }
  };

  const resetFilters = () => {
    setFilters({ keyword: '', location: '', jobType: [], experienceLevel: [], minSalary: '', maxSalary: '' });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${pagination.total} jobs found`}
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden btn-secondary flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20">
            <JobFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <JobFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
              <button onClick={resetFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSave={user?.role === 'student' ? handleSaveJob : null}
                    isSaved={user?.savedJobs?.includes(job._id)}
                    showSave={user?.role === 'student'}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchJobs(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === pagination.current
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}