import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Printer,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { eventService } from '../../services/eventService';
import { formatDateTime } from '../../utils/helpers';

const EventAttendees = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    eventTitle: '',
    capacity: 0,
    registeredCount: 0,
    attendees: [],
  });
  const [search, setSearch] = useState('');

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEventAttendees(id);
      if (res.success) {
        setData(res);
      }
    } catch (error) {
      console.error('[EventAttendees Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const filteredAttendees = data.attendees?.filter((a) => {
    const s = a.student;
    if (!s) return false;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events Console</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Registered Student Roster
          </h1>
          <p className="text-xs text-slate-500">
            Event: <strong className="text-slate-800">{data.eventTitle || 'Loading...'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Roster
          </Button>
        </div>
      </div>

      {/* Capacity & Stats Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center border border-indigo-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enrollment Status
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {data.registeredCount} / {data.capacity} Confirmed Attendees
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Occupancy</span>
            <span>
              {Math.min(
                100,
                Math.round((data.registeredCount / (data.capacity || 1)) * 100)
              )}
              %
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((data.registeredCount / (data.capacity || 1)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter attendees by name, ID, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">#</th>
                <th className="py-3.5 px-6">Student Name & Roll No.</th>
                <th className="py-3.5 px-6">Department & Semester</th>
                <th className="py-3.5 px-6">Contact Email & Phone</th>
                <th className="py-3.5 px-6 text-right">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : filteredAttendees?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Users}
                      title="No attendees registered yet"
                      description="Students have not yet booked seats for this event."
                    />
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((item, index) => {
                  const student = item.student;
                  if (!student) return null;
                  return (
                    <tr
                      key={item.registrationId}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-semibold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900 text-sm">
                          {student.name}
                        </div>
                        <span className="text-[11px] font-semibold text-brand-600">
                          {student.studentId || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="font-medium text-slate-800">
                          {student.department}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Semester {student.semester || 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right text-slate-500 font-medium">
                        {formatDateTime(item.registeredAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;
