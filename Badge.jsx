import React from 'react';
import { getPriorityStyles, getStatusColor, getCategoryColor } from '../../utils/helpers';

const Badge = ({
  children,
  type = 'default', // 'priority', 'status', 'category', 'default'
  value = '',
  className = '',
  dot = false,
}) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (type === 'priority') {
    const pStyles = getPriorityStyles(value || children);
    badgeStyle = pStyles.badge;
    dotColor = pStyles.dot;
  } else if (type === 'status') {
    badgeStyle = getStatusColor(value || children);
  } else if (type === 'category') {
    badgeStyle = getCategoryColor(value || children);
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>}
      <span className="capitalize">{children || value}</span>
    </span>
  );
};

export default Badge;
