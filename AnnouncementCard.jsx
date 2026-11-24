import React, { useState } from 'react';
import { Pin, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate, getPriorityStyles } from '../../utils/helpers';

const AnnouncementCard = ({
  announcement,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const pStyles = getPriorityStyles(announcement.priority);

  return (
    <div
      className={`bg-white rounded-2xl border ${
        announcement.isPinned ? 'border-amber-300 shadow-soft' : 'border-slate-200 shadow-card'
      } p-6 hover:shadow-soft transition-all duration-200 relative overflow-hidden border-l-4 ${pStyles.border}`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {announcement.isPinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
              Pinned Notice
            </span>
          )}
          <Badge type="priority" value={announcement.priority} dot />
          <Badge type="category" value={announcement.category} />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(announcement.createdAt)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-2">
        {announcement.title}
      </h3>

      {/* Content preview or full */}
      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
        <p className={expanded ? '' : 'line-clamp-2'}>
          {announcement.content}
        </p>

        {announcement.content.length > 150 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 pt-1 focus:outline-none"
          >
            <span>{expanded ? 'Show Less' : 'Read Full Announcement'}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Footer / Author & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Posted by: <strong className="text-slate-700">{announcement.author?.name || 'College Admin'}</strong></span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(announcement)}
                className="text-slate-600"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(announcement._id)}
                className="text-rose-600 hover:bg-rose-50"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
