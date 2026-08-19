'use client';

import React from 'react';
import { calculatePasswordStrength } from '@/lib/utils/validation';
import styles from '@/styles/auth.module.css';

/**
 * Visual 4-segment password strength meter with real-time feedback.
 */
export default function PasswordStrength({ password }) {
  if (!password) return null;

  const { score, label, className } = calculatePasswordStrength(password);

  return (
    <div className={styles.strengthMeter}>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4].map((index) => {
          const isFilled = index <= score;
          return (
            <div
              key={index}
              className={`
                ${styles.strengthSegment}
                ${isFilled ? `${styles.filled} ${styles[className]}` : ''}
              `.trim()}
            />
          );
        })}
      </div>
      <div className={`${styles.strengthLabel} ${styles[className] || ''}`.trim()}>
        Strength: <strong>{label}</strong>
      </div>
    </div>
  );
}
