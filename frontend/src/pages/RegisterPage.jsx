import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Briefcase, Eye, EyeOff, Loader2, GraduationCap, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome, ${data.user.name}! Account created.`);
      navigate(data.user.role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join thousands of job seekers</p>
        </div>

        <div className="card">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'student', label: 'Student / Job Seeker', Icon: GraduationCap },
                { value: 'recruiter', label: 'Recruiter / Employer', Icon: Building2 },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    form.role === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${form.role === value ? 'text-primary-600' : 'text-gray-400'}`} />
                  <p className={`text-xs font-medium ${form.role === value ? 'text-primary-700' : 'text-gray-600'}`}>{label}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="input-field pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}