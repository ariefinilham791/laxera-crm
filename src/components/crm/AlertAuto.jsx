'use client'
import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { CheckCircle } from 'react-feather';

const AlertAuto = ({ show, onClose, variant = 'success', children, duration = 3000, toast }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;
  const className = toast ? 'crm-toast-alert shadow-sm' : '';
  return (
    <Alert variant={variant} onClose={onClose} dismissible className={className}>
      {variant === 'success' && (
        <span className="feather-icon me-2"><CheckCircle size={18} /></span>
      )}
      {children}
    </Alert>
  );
}

export default AlertAuto
