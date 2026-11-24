import React from 'react';
import { FileText, Download, Trash2, Calendar, BookOpen } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { materialService } from '../../services/materialService';

const MaterialCard = ({
  material,
  isAdmin = false,
  onDelete,
}) => {
  const handleDownload = () => {
    const downloadUrl = materialService.downloadMaterialUrl(material._id);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        {/* Header tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-700 border border-indigo-100">
            <BookOpen className="w-3 h-3" />
            Sem {material.semester}
          </span>

          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[150px]">
            {material.department}
          </span>
        </div>

        {/* Subject & Title */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wide">
            {material.subject}
          </p>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
            {material.title}
          </h3>
        </div>

        {/* Description */}
        {material.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {material.description}
          </p>
        )}

        {/* File meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatFileSize(material.fileSize)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(material.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          icon={Download}
          className="flex-1"
        >
          Download File
        </Button>

        {isAdmin && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(material._id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Material"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;
