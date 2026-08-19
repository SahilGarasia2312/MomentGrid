'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth.module.css';

/**
 * Reusable Input field component with icon support, toggleable password visibility, and error states.
 */
export default function Input({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  icon: IconComponent,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {IconComponent && (
          <span className={styles.inputIcon}>
            <IconComponent size={18} />
          </span>
        )}

        <input
          id={id || name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            ${styles.input}
            ${!IconComponent ? styles.noIcon : ''}
            ${isPassword ? styles.withSuffix : ''}
            ${error ? styles.error : ''}
          `.trim()}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.inputSuffix}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.fieldError} role="alert">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className={styles.fieldSuccess}>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
