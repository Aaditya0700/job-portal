import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, Building2, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const POPULAR_SEARCHES = ['React Developer', 'Data Scientist', 'UI/UX Designer', 'Backend Engineer', 'Product Manager', 'DevOps'];

const STATS = [
  { icon: Briefcase, label: 'Active Jobs', value: '10,000+' },
  { icon: Users, label: 'Students Placed', value: '50,000+' },
  { icon: Building2, label: 'Companies', value: '2,000+' },
  { icon: TrendingUp, label: 'Success Rate', value: '94%' },
];

const FEATURES = [
  { title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills and profile.' },
  { title: 'Real-time Notifications', desc: 'Get instant alerts when your application status changes.' },
  { title: 'Resume Builder', desc: 'Upload your resume and let recruiters find you.' },
  { title: 'Direct Application', desc: 'Apply in one click with your saved profile.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              10,000+ new jobs this week
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find Your Dream Job<br />
              <span className="text-indigo-300">Land It With Confidence</span>
            </h1>
            <p className="text-lg text-indigo-200 mb-10 max-w-xl mx-auto">
              Connect with top companies, upload your resume, and get placed faster than ever.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skills, company..."
                  className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-sm py-2"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 sm:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, state or remote"
                  className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-sm py-2"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap sm:px-6 rounded-xl">
                Search Jobs
              </button>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="text-sm text-indigo-300">Popular:</span>
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(s)}`)}
                  className="text-sm text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="card text-center shadow-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose JobPortal?</h2>
          <p className="text-gray-500 mt-3">Everything you need to accelerate your career journey</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ title, desc }) => (
            <div key={title} className="card hover:shadow-md transition-shadow">
              <CheckCircle className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">Join thousands of students finding their dream jobs every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3 text-base rounded-xl">
              Create Free Account
            </Link>
            <Link to="/jobs" className="btn-secondary px-8 py-3 text-base rounded-xl flex items-center justify-center gap-2">
              Browse Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}