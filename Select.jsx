import React from 'react';

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`block w-full rounded-xl text-sm transition-all duration-150 border bg-white px-3.5 py-2.5 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-brand-200'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option
            key={typeof opt === 'object' ? opt.value : opt}
            value={typeof opt === 'object' ? opt.value : opt}
          >
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
