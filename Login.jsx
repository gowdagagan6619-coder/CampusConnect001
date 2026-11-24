import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, Shield, User } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials helper
  const handleQuickFill = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@campusconnect.edu');
      setPassword('AdminPassword123!');
    } else {
      setEmail('alex.johnson@campusconnect.edu');
      setPassword('StudentPassword123!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to CampusConnect
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to access your student or administrator portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. your.name@campusconnect.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Quick-Fill Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 text-brand-700 text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200/80"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-200/80"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              New student?{' '}
              <Link
                to="/register"
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                Create your student account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
