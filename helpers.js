/**
 * Format ISO date string into readable format: "Nov 25, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format ISO date string into readable format with time: "Nov 25, 2026, 10:00 AM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format bytes into human-readable file sizes: "4.2 MB", "850 KB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Get styling colors for priority levels
 */
export const getPriorityStyles = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
        dot: 'bg-rose-500',
        border: 'border-l-rose-500',
      };
    case 'high':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        dot: 'bg-amber-500',
        border: 'border-l-amber-500',
      };
    case 'medium':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        dot: 'bg-blue-500',
        border: 'border-l-blue-500',
      };
    case 'low':
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        badge: 'bg-slate-100 text-slate-700',
        dot: 'bg-slate-400',
        border: 'border-l-slate-400',
      };
  }
};

/**
 * Get category badge color mapping
 */
export const getCategoryColor = (category) => {
  switch (category) {
    case 'Technical':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Cultural':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Sports':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Workshop':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Seminar':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'Academic':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Exam':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Placement':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

/**
 * Get status badge color mapping
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'ongoing':
      return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
    case 'completed':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'cancelled':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
