import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const icons = {
  danger: { icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  warning: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  info: { icon: Info, color: 'text-blue-600 bg-blue-50 border-blue-100' },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  const IconComponent = icons[type]?.icon || AlertTriangle;
  const colorStyle = icons[type]?.color || icons.danger.color;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorStyle} mb-4`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
