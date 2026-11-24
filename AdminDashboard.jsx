import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle2,
  Bell,
  BookOpen,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import { StatSkeleton } from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalAnnouncements: 0,
    totalMaterials: 0,
    categoryDistribution: [],
    recentRegistrations: [],
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('[AdminDashboard Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Calculate highest category count for bar scaling
  const maxCategoryCount = Math.max(
    ...(stats.categoryDistribution?.map((c) => c.count) || [1]),
    1
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Administrator Console</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Analytics & Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor real-time student registrations, event capacity metrics, and campus circular broadcasts across all academic departments.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>

          <Link
            to="/admin/announcements"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <Bell className="w-4 h-4" />
            <span>Post Notice</span>
          </Link>
        </div>

        <div className="absolute right-0 top-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="indigo"
              subtitle="Enrolled accounts"
            />
            <StatCard
              title="Campus Events"
              value={stats.totalEvents}
              icon={Calendar}
              color="emerald"
              subtitle="Published activities"
            />
            <StatCard
              title="Registrations"
              value={stats.totalRegistrations}
              icon={CheckCircle2}
              color="purple"
              subtitle="Total seats booked"
            />
            <StatCard
              title="Announcements"
              value={stats.totalAnnouncements}
              icon={Bell}
              color="amber"
              subtitle="Active circulars"
            />
            <StatCard
              title="Study Materials"
              value={stats.totalMaterials}
              icon={BookOpen}
              color="blue"
              subtitle="Repository files"
            />
          </>
        )}
      </div>

      {/* Analytics Chart & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart: Event Category Distribution */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Event Categories Breakdown
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              {stats.totalEvents} Total Events
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Distribution of scheduled events across technical, cultural, and academic tracks:
          </p>

          <div className="space-y-3 pt-2">
            {stats.categoryDistribution?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No events categorized yet.
              </p>
            ) : (
              stats.categoryDistribution?.map((cat) => {
                const percentage = Math.round(
                  (cat.count / (stats.totalEvents || 1)) * 100
                );
                const barWidth = Math.round((cat.count / maxCategoryCount) * 100);

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">
                        {cat.category}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {cat.count} events ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Registration Feed Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Student Registrations
              </h2>
              <p className="text-xs text-slate-500">
                Latest student enrollments across all campus competitions & workshops
              </p>
            </div>
            <Link
              to="/admin/events"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3 font-semibold">Student Name</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Enrolled Event</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats.recentRegistrations?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                      No registrations logged yet. Run the seeder to populate demo activity.
                    </td>
                  </tr>
                ) : (
                  stats.recentRegistrations?.map((reg) => (
                    <tr key={reg._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-bold text-slate-900">
                        {reg.student?.name || 'Student'}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {reg.student?.studentId || reg.student?.email}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 truncate max-w-[140px]">
                        {reg.student?.department || 'General'}
                      </td>
                      <td className="py-3 font-medium text-brand-700 max-w-[160px] truncate">
                        {reg.event?.title || 'Event'}
                      </td>
                      <td className="py-3">
                        <Badge type="category" value={reg.event?.category} />
                      </td>
                      <td className="py-3 text-right text-slate-400">
                        {formatDate(reg.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
