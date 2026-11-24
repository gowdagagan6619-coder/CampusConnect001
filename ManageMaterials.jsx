import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Download,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { materialService } from '../../services/materialService';
import { formatDate, formatFileSize } from '../../utils/helpers';

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'General',
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
  value: s,
  label: `Semester ${s}`,
}));

const ManageMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: departments[0],
    semester: 1,
  });
  const [file, setFile] = useState(null);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    id: null,
    loading: false,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedSem !== 'All') params.semester = selectedSem;

      const data = await materialService.getMaterials(params);
      setMaterials(data.materials || []);
    } catch (error) {
      console.error('[ManageMaterials Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMaterials();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedSem]);

  const handleOpenUploadModal = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      department: departments[0],
      semester: 1,
    });
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a document file to upload.');
      return;
    }

    setUploading(true);
    setFeedback({ type: '', message: '' });

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('subject', formData.subject);
      data.append('department', formData.department);
      data.append('semester', formData.semester);
      data.append('file', file);

      await materialService.createMaterial(data);
      setFeedback({ type: 'success', message: 'Study material uploaded successfully.' });
      setModalOpen(false);
      await fetchMaterials();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload study material.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await materialService.deleteMaterial(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, loading: false });
      setFeedback({ type: 'success', message: 'Resource removed from repository.' });
      await fetchMaterials();
    } catch (err) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete resource.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Materials Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload lecture notes, lab manuals, and question banks for student access
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenUploadModal}
          size="md"
        >
          Upload Study Material
        </Button>
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
            placeholder="Search by subject, title, or topic..."
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

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Material Title & Subject</th>
                <th className="py-3.5 px-6">Department & Semester</th>
                <th className="py-3.5 px-6">File Details</th>
                <th className="py-3.5 px-6">Date Added</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : materials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={BookOpen}
                      title="No study materials found"
                      description="Upload lecture slides, notes, or syllabus files to the academic repository."
                      actionLabel="Upload Material"
                      onAction={handleOpenUploadModal}
                    />
                  </td>
                </tr>
              ) : (
                materials.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.title}
                      </div>
                      <span className="text-[11px] font-semibold text-brand-600 block">
                        {item.subject}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">
                        {item.department}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-brand-700 border border-indigo-100 mt-0.5">
                        Semester {item.semester}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]">
                          {item.originalFileName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatFileSize(item.fileSize)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={materialService.downloadMaterialUrl(item._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              id: item._id,
                              loading: false,
                            })
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Academic Study Resource"
        subtitle="Add lecture slides, laboratory manuals, notes, and past exams"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Resource Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Data Structures & Algorithms - Complete Slides"
            required
          />

          <Input
            label="Subject Name"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. Data Structures & Algorithms"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={departments}
              required
            />

            <Select
              label="Target Semester"
              name="semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              options={semesters}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Resource Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide a brief summary of topics covered in this file..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Document File <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              required
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Allowed: PDF, DOCX, PPTX, TXT, ZIP. Maximum file size: 25MB.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={uploading}
              icon={Upload}
            >
              Upload Material
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Study Material?"
        message="This will permanently delete this document and remove its physical file from server storage."
        confirmText="Yes, Delete File"
        cancelText="Keep File"
        type="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default ManageMaterials;
