import React from 'react';
import './Input.scss';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? 'input--error' : ''}`}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}; 