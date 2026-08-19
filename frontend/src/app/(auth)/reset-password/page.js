import React, { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import styles from '@/styles/auth.module.css';

export const metadata = {
  title: 'Choose New Password — MomentGrid',
  description: 'Set a new secure password for your MomentGrid account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="animate-fade-up">
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Set New Password</h1>
        <p className={styles.formSubtitle}>
          Choose a strong password to protect your studio data and galleries.
        </p>
      </header>

      <Suspense fallback={<div className={styles.verifySpinner} />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
