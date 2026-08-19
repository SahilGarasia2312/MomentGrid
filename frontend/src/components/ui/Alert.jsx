'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import styles from '@/styles/auth.module.css';

/**
 * Reusable banner / alert box with different semantic severity levels.
 */
export default function Alert({
  variant = 'error', // 'error' | 'success' | 'info' | 'warning'
  title,
  message,
  children,
  className = '',
}) {
  if (!message && !children && !title) return null;

  const variantMap = {
    error: {
      class: styles.alertError,
      icon: <AlertCircle size={18} />,
    },
    success: {
      class: styles.alertSuccess,
      icon: <CheckCircle2 size={18} />,
    },
    info: {
      class: styles.alertInfo,
      icon: <Info size={18} />,
    },
    warning: {
      class: styles.alertWarning,
      icon: <AlertTriangle size={18} />,
    },
  };

  const config = variantMap[variant] || variantMap.error;

  return (
    <div className={`${styles.alert} ${config.class} ${className}`.trim()} role="alert">
      <span className={styles.alertIcon}>{config.icon}</span>
      <div className={styles.alertBody}>
        {title && <div className={styles.alertTitle}>{title}</div>}
        {message && <div className={styles.alertMessage}>{message}</div>}
        {children && <div className={styles.alertMessage}>{children}</div>}
      </div>
    </div>
  );
}
