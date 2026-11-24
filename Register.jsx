import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Hash,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Business Administration',
  'General Sciences',
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
  value: s,
  label: `Semester ${s}`,
}));

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: departments[0],
    semester: 1,
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        department: formData.department,
        semester: Number(formData.semester),
        phone: formData.phone,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Join CampusConnect to explore events, track announcements, and download materials
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="e.g. Alex Johnson"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Student ID / Roll No."
                name="studentId"
                placeholder="e.g. CS2024-042"
                icon={Hash}
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="College Email Address"
              name="email"
              type="email"
              placeholder="e.g. alex.johnson@campusconnect.edu"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departments}
                required
              />

              <Select
                label="Current Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                options={semesters}
                required
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="e.g. +1 (555) 019-2831"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
            >
              Complete Registration
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
