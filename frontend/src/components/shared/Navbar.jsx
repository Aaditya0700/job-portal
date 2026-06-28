import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Menu, X, User, LogOut, LayoutDashboard,
  BookmarkCheck, Building2, PlusCircle, Shield,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive(to) ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
      }`}
      onClick={() => setMobileOpen(false)}
    >
      {label}
    </Link>
  );

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'recruiter') return '/recruiter';
    return '/dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">JobPortal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/jobs', 'Browse Jobs')}
            {user?.role === 'recruiter' && navLink('/post-job', 'Post a Job')}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user.profile?.profilePhoto ? (
                      <img src={user.profile.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-700 font-semibold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    {user.role === 'student' && (
                      <Link to="/saved-jobs" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <BookmarkCheck className="w-4 h-4" /> Saved Jobs
                      </Link>
                    )}
                    {user.role === 'recruiter' && (
                      <Link to="/company" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <Building2 className="w-4 h-4" /> My Company
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Log in</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLink('/jobs', 'Browse Jobs')}
          {user ? (
            <>
              {navLink(getDashboardLink(), 'Dashboard')}
              {navLink('/profile', 'Profile')}
              {user.role === 'student' && navLink('/saved-jobs', 'Saved Jobs')}
              {user.role === 'recruiter' && navLink('/post-job', 'Post a Job')}
              {user.role === 'recruiter' && navLink('/company', 'My Company')}
              <button onClick={handleLogout} className="text-sm text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}