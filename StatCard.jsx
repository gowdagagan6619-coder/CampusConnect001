import React from 'react';

const colorStyles = {
  indigo: 'bg-indigo-50 text-brand-600 border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
  className = '',
}) => {
  const iconStyle = colorStyles[color] || colorStyles.indigo;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-soft transition-all duration-200 flex items-center justify-between ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value ?? 0}
        </p>
        {subtitle && (
          <p className="text-xs font-medium text-slate-400">{subtitle}</p>
        )}
      </div>

      {Icon && (
        <div
          className={`w-13 h-13 p-3.5 rounded-2xl flex items-center justify-center border ${iconStyle}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
