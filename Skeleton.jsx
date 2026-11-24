import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
};

export const StatSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className="h-4 w-full max-w-[120px] rounded-md" />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;
