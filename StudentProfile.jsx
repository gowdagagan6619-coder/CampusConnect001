import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Hash,
  Building,
  Calendar,
  Phone,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Business Administration',
  'General',
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
  value: s,
  label: `Semester ${s}`,
}));

const StudentProfile = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'security'

  // General profile state
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || departments[0]);
  const [semester, setSemester] = useState(user?.semester || 1);
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' });

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileFeedback({ type: '', message: '' });
    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('department', department);
      formData.append('semester', semester);
      formData.append('phone', phone);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await authService.updateProfile(formData);
      updateUser(res.user);
      setProfileFeedback({
        type: 'success',
        message: 'Your profile information has been updated successfully.',
      });
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile details.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    setSavingPassword(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordFeedback({
        type: 'success',
        message: 'Password changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-3xl flex items-center justify-center border-2 border-brand-200 overflow-hidden shadow-sm">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            )}
          </div>

          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-md cursor-pointer"
            title="Upload profile picture"
          >
            <Camera className="w-4 h-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {user?.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-700 border border-indigo-200 capitalize">
              {user?.role}
            </span>
          </div>

          <p className="text-xs text-slate-500">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-brand-600" />
              ID: {user?.studentId || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-brand-600" />
              {user?.department || 'General'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Semester {user?.semester || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>General Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Tab 1: General Info Form */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          {profileFeedback.message && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {profileFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{profileFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

              <Input
                label="Registered College Email"
                name="email"
                value={user?.email || ''}
                icon={Mail}
                disabled
                helperText="Email is managed by college administration."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={departments}
                required
              />

              <Select
                label="Semester"
                name="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                options={semesters}
                required
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              placeholder="+1 (555) 000-0000"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={savingProfile}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password Form */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          {passwordFeedback.message && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                passwordFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {passwordFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={savingPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
