import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import styles from '@/styles/auth.module.css';

export const metadata = {
  title: 'Forgot Password — MomentGrid',
  description: 'Request a password reset link for your MomentGrid account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-up">
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Reset Password</h1>
        <p className={styles.formSubtitle}>
          Enter the email address associated with your account and we&apos;ll send you a secure reset link.
        </p>
      </header>

      <ForgotPasswordForm />
    </div>
  );
}
