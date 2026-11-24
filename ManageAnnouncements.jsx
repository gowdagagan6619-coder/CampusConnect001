import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Pin,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { announcementService } from '../../services/announcementService';
import { formatDate } from '../../utils/helpers';

const priorities = ['urgent', 'high', 'medium', 'low'];
const categories = ['General', 'Academic', 'Exam', 'Event', 'Placement', 'Urgent'];

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'General',
    targetAudience: 'all',
    isPinned: false,
  });

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    id: null,
    loading: false,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const data = await announcementService.getAnnouncements(params);
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('[ManageAnnouncements Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, priorityFilter]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      category: 'General',
      targetAudience: 'all',
      isPinned: false,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      priority: item.priority,
      category: item.category,
      targetAudience: item.targetAudience,
      isPinned: item.isPinned,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      if (editingItem) {
        await announcementService.updateAnnouncement(editingItem._id, formData);
        setFeedback({ type: 'success', message: 'Announcement updated.' });
      } else {
        await announcementService.createAnnouncement(formData);
        setFeedback({ type: 'success', message: 'New announcement broadcasted.' });
      }

      setModalOpen(false);
      await fetchAnnouncements();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save announcement.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await announcementService.deleteAnnouncement(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, loading: false });
      setFeedback({ type: 'success', message: 'Announcement deleted.' });
      await fetchAnnouncements();
    } catch (err) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete announcement.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Announcements & Circulars Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast official notices, pin urgent alerts, and categorize student communications
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenCreateModal}
          size="md"
        >
          Publish Circular
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

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                Priority: {p.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Notice Title & Preview</th>
                <th className="py-3.5 px-6">Priority & Topic</th>
                <th className="py-3.5 px-6">Pinned Status</th>
                <th className="py-3.5 px-6">Date Posted</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Bell}
                      title="No announcements found"
                      description="Broadcast a new notice to inform campus students."
                      actionLabel="Broadcast Notice"
                      onAction={handleOpenCreateModal}
                    />
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 max-w-md">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.content}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Badge type="priority" value={item.priority} dot />
                        <Badge type="category" value={item.category} />
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {item.isPinned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Pinned Alert
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          title="Edit Announcement"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              id: item._id,
                              loading: false,
                            })
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Announcement"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Circular Notice' : 'Broadcast Campus Notice'}
        subtitle="Post a campus announcement with priority indicators and pinned banners"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Announcement Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Mid-Semester Exam Guidelines Published"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorities.map((p) => ({ value: p, label: p.toUpperCase() }))}
              required
            />

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notice Content
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Type the full announcement message for students..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              required
            />
          </div>

          {/* Pinned Switch */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isPinned" className="text-xs font-bold text-slate-700 cursor-pointer">
              Pin to Top (Displays on Student Dashboard hero alerts)
            </label>
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
              loading={saving}
            >
              {editingItem ? 'Save Changes' : 'Broadcast'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement?"
        message="This will immediately remove this notice from the student notice board."
        confirmText="Yes, Delete Notice"
        cancelText="Keep Notice"
        type="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default ManageAnnouncements;
