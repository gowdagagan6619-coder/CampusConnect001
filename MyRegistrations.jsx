import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/helpers';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, eventId: null, loading: false });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await eventService.getMyRegistrations();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('[MyRegistrations Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelClick = (eventId) => {
    setCancelModal({ isOpen: true, eventId, loading: false });
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelModal((prev) => ({ ...prev, loading: true }));
      await eventService.cancelRegistration(cancelModal.eventId);
      setCancelModal({ isOpen: false, eventId: null, loading: false });
      setFeedback({ type: 'success', message: 'Registration cancelled successfully.' });
      await fetchRegistrations();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Registered Events
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your enrolled schedule, venue details, and registration status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {registrations.length} Events Enrolled
          </span>
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

      {/* Registrations List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-32"
            />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="You have no registered events"
          description="Browse the campus events catalog to find hackathons, sports tournaments, and workshops to join."
          actionLabel="Explore Campus Events"
          onAction={() => (window.location.href = '/events')}
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const event = reg.event;
            if (!event) return null;
            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Event info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge type="category" value={event.category} />
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Registration Confirmed
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{event.eventTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Right side / cancellation action */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    Booked on {formatDate(reg.registrationDate)}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelClick(event._id)}
                    className="text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                    icon={Trash2}
                  >
                    Cancel Registration
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, eventId: null, loading: false })}
        onConfirm={handleConfirmCancel}
        title="Cancel Event Enrollment?"
        message="Are you sure you want to cancel your seat? This seat will immediately be offered to other students."
        confirmText="Yes, Cancel"
        cancelText="Keep Registration"
        type="danger"
        loading={cancelModal.loading}
      />
    </div>
  );
};

export default MyRegistrations;
