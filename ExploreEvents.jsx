import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, AlertCircle } from 'lucide-react';
import EventCard from '../../components/cards/EventCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { eventService } from '../../services/eventService';

const categories = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Academic',
  'Other',
];

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [registeringId, setRegisteringId] = useState(null);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, eventId: null, loading: false });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const data = await eventService.getEvents(params);
      setEvents(data.events || []);
    } catch (error) {
      console.error('[ExploreEvents Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250); // Debounce search
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedStatus]);

  const handleRegister = async (eventId) => {
    try {
      setRegisteringId(eventId);
      setFeedback({ type: '', message: '' });
      await eventService.registerForEvent(eventId);
      setFeedback({ type: 'success', message: 'Successfully registered for event!' });
      await fetchEvents();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Failed to register for event.',
      });
    } finally {
      setRegisteringId(null);
    }
  };

  const handleCancelClick = (eventId) => {
    setCancelModal({ isOpen: true, eventId, loading: false });
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelModal((prev) => ({ ...prev, loading: true }));
      await eventService.cancelRegistration(cancelModal.eventId);
      setCancelModal({ isOpen: false, eventId: null, loading: false });
      setFeedback({ type: 'success', message: 'Registration cancelled successfully.' });
      await fetchEvents();
    } catch (error) {
      setCancelModal((prev) => ({ ...prev, loading: false }));
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel registration.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Events
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse upcoming workshops, hackathons, sports, and cultural festivals
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, venue, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Notification Banner */}
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

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events matching criteria"
          description="Try broadening your search term or switching to another event category."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              onCancel={handleCancelClick}
              isRegistering={registeringId === event._id}
            />
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, eventId: null, loading: false })}
        onConfirm={handleConfirmCancel}
        title="Cancel Event Registration?"
        message="Are you sure you want to surrender your seat? Your spot will immediately become available for other campus students."
        confirmText="Yes, Cancel Registration"
        cancelText="Keep Registration"
        type="danger"
        loading={cancelModal.loading}
      />
    </div>
  );
};

export default ExploreEvents;
