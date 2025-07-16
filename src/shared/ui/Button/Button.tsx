import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  loading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`button button--${variant} ${loading ? 'button--loading' : ''} ${className}`}
    >
      {children}
    </button>
  );
}; 