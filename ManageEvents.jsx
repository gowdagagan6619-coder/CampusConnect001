import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  Users,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Upload,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/helpers';

const categories = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Academic',
  'Other',
];

const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const ManageEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    eventDate: '',
    eventTime: '10:00 AM',
    capacity: 100,
    status: 'Upcoming',
  });
  const [bannerFile, setBannerFile] = useState(null);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    eventId: null,
    loading: false,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const data = await eventService.getEvents(params);
      setEvents(data.events || []);
    } catch (error) {
      console.error('[ManageEvents Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      venue: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '10:00 AM',
      capacity: 100,
      status: 'Upcoming',
    });
    setBannerFile(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      eventDate: new Date(event.eventDate).toISOString().split('T')[0],
      eventTime: event.eventTime,
      capacity: event.capacity,
      status: event.status,
    });
    setBannerFile(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('venue', formData.venue);
      data.append('eventDate', formData.eventDate);
      data.append('eventTime', formData.eventTime);
      data.append('capacity', formData.capacity);
      data.append('status', formData.status);
      if (bannerFile) {
        data.append('banner', bannerFile);
      }

      if (editingEvent) {
        await eventService.updateEvent(editingEvent._id, data);
        setFeedback({ type: 'success', message: 'Event updated successfully.' });
      } else {
        await eventService.createEvent(data);
        setFeedback({ type: 'success', message: 'New event published successfully.' });
      }

      setModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save event.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await eventService.deleteEvent(deleteDialog.eventId);
      setDeleteDialog({ isOpen: false, eventId: null, loading: false });
      setFeedback({ type: 'success', message: 'Event and registrations deleted.' });
      await fetchEvents();
    } catch (err) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete event.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Event Management Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and schedule college events, track capacity limits, and review student rosters
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenCreateModal}
          size="md"
        >
          Publish New Event
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
            placeholder="Search by event title, venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Event Title & Category</th>
                <th className="py-3.5 px-6">Schedule & Venue</th>
                <th className="py-3.5 px-6">Capacity Status</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Calendar}
                      title="No events scheduled"
                      description="Create your first event by clicking 'Publish New Event'."
                      actionLabel="Publish New Event"
                      onAction={handleOpenCreateModal}
                    />
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const percentFilled = Math.min(
                    100,
                    Math.round((event.registeredCount / event.capacity) * 100)
                  );
                  return (
                    <tr
                      key={event._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-sm">
                            {event.title}
                          </p>
                          <Badge type="category" value={event.category} />
                        </div>
                      </td>

                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-brand-600" />
                          <span>
                            {formatDate(event.eventDate)} at {event.eventTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[180px]">{event.venue}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                            <span>
                              {event.registeredCount} / {event.capacity}
                            </span>
                            <span>{percentFilled}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                percentFilled >= 100 ? 'bg-rose-500' : 'bg-brand-600'
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <Badge type="status" value={event.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/events/${event._id}/attendees`)
                            }
                            icon={Users}
                            title="View registered student roster"
                          >
                            Roster
                          </Button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(event)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                eventId: event._id,
                                loading: false,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Publish New Campus Event'}
        subtitle="Specify event timing, venue, attendee constraints, and category"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI Innovation Hackathon 2026"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
              required
            />

            <Select
              label="Event Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statuses}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              required
            />

            <Input
              label="Event Time"
              name="eventTime"
              value={formData.eventTime}
              onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
              placeholder="e.g. 10:00 AM"
              required
            />

            <Input
              label="Capacity (Max Seats)"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>

          <Input
            label="Venue / Location"
            name="venue"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="e.g. Auditorium Hall B, 2nd Floor"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Event Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive summary of the schedule, mentors, and prize pool..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              required
            />
          </div>

          {/* Banner image upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Event Banner Poster (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              {editingEvent ? 'Save Changes' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, eventId: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Campus Event?"
        message="This will permanently delete this event and remove all registered students from this event roster. This action cannot be undone."
        confirmText="Yes, Delete Event"
        cancelText="Keep Event"
        type="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default ManageEvents;
