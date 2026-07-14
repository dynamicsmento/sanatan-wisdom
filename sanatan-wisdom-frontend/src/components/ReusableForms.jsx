import React from 'react';

export const InputField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-text/80 font-serif">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm text-text placeholder-text/40 shadow-soft focus:outline-none transition-all duration-300 ${
          error
            ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-100'
            : 'border-gold/30 focus:border-primary focus:ring-1 focus:ring-primary/20'
        }`}
        {...props}
      />
      {error && <p className="text-2xs font-semibold text-red-600 pl-1">{error}</p>}
    </div>
  );
};

export const TextAreaField = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-text/80 font-serif">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-4 py-3 bg-background border rounded-xl text-sm text-text placeholder-text/40 shadow-soft focus:outline-none transition-all duration-300 resize-none ${
          error
            ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-100'
            : 'border-gold/30 focus:border-primary focus:ring-1 focus:ring-primary/20'
        }`}
        {...props}
      />
      {error && <p className="text-2xs font-semibold text-red-600 pl-1">{error}</p>}
    </div>
  );
};
