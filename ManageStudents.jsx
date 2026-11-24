import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const departments = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'General',
];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    studentId: null,
    loading: false,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedSem !== 'All') params.semester = selectedSem;

      const data = await adminService.getStudents(params);
      setStudents(data.students || []);
    } catch (error) {
      console.error('[ManageStudents Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedSem]);

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await adminService.deleteStudent(deleteDialog.studentId);
      setDeleteDialog({ isOpen: false, studentId: null, loading: false });
      setFeedback({ type: 'success', message: 'Student account and registrations deleted.' });
      await fetchStudents();
    } catch (err) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete student.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Accounts Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse enrolled student profiles, academic departments, and registration credentials
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 self-start sm:self-auto">
          {students.length} Enrolled Students
        </span>
      </div>

      {/* Notifications */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-xs font-bold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, email, or Student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-40">
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Student Name & Roll No.</th>
                <th className="py-3.5 px-6">Department & Semester</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Users}
                      title="No students found"
                      description="No student accounts match the given search query or filters."
                      actionLabel="Reset Filters"
                      onAction={() => {
                        setSearch('');
                        setSelectedDept('All');
                        setSelectedSem('All');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0 border border-brand-200">
                          {student.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {student.name}
                          </div>
                          <span className="text-[11px] font-semibold text-brand-600">
                            {student.studentId || 'No ID assigned'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">
                        {student.department}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mt-0.5">
                        Semester {student.semester || 1}
                      </span>
                    </td>

                    <td className="py-4 px-6 space-y-0.5">
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

                    <td className="py-4 px-6 text-slate-500">
                      {formatDate(student.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            studentId: student._id,
                            loading: false,
                          })
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Student Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, studentId: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Account?"
        message="This will permanently delete this student record and cancel all of their active event registrations."
        confirmText="Yes, Delete Student"
        cancelText="Keep Account"
        type="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default ManageStudents;
