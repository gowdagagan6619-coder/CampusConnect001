import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

const categoryGradients = {
  Technical: 'from-blue-600 to-indigo-700',
  Cultural: 'from-purple-600 to-pink-600',
  Sports: 'from-emerald-600 to-teal-700',
  Workshop: 'from-amber-500 to-orange-600',
  Seminar: 'from-cyan-600 to-blue-700',
  Academic: 'from-indigo-600 to-violet-700',
  Other: 'from-slate-600 to-slate-800',
};

const EventCard = ({
  event,
  onRegister,
  onCancel,
  onViewAttendees,
  onEdit,
  onDelete,
  isAdmin = false,
  isRegistering = false,
  isCancelling = false,
}) => {
  const isFull = event.registeredCount >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / event.capacity) * 100)
  );
  const gradient = categoryGradients[event.category] || categoryGradients.Other;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner Area */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-tr ${gradient} flex flex-col justify-end p-5 text-white`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                {event.category}
              </span>
              <p className="text-xl font-extrabold line-clamp-2 drop-shadow-sm">
                {event.title}
              </p>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Badge type="category" value={event.category} />
            <Badge type="status" value={event.status} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Details List */}
          <div className="space-y-1.5 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{formatDate(event.eventDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{event.eventTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Capacity
              </span>
              <span
                className={`font-semibold ${
                  isFull ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                {event.registeredCount} / {event.capacity} ({spotsLeft} left)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isFull
                    ? 'bg-rose-500'
                    : percentFilled > 80
                    ? 'bg-amber-500'
                    : 'bg-brand-600'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-2">
        {isAdmin ? (
          <div className="flex items-center gap-2 pt-3">
            {onViewAttendees && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAttendees(event)}
                className="flex-1"
              >
                Roster
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(event)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(event._id)}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          <div className="pt-3">
            {event.isRegistered ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled</span>
                </div>
                {onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(event._id)}
                    loading={isCancelling}
                    className="text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            ) : isFull ? (
              <Button variant="secondary" size="md" disabled className="w-full">
                Event Full
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => onRegister(event._id)}
                loading={isRegistering}
                className="w-full"
              >
                Register Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
