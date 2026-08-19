import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import styles from '@/styles/auth.module.css';

export const metadata = {
  title: 'Sign In — MomentGrid',
  description: 'Sign in to your MomentGrid studio or photographer account.',
};

export default function LoginPage() {
  return (
    <div className="animate-fade-up">
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Welcome back</h1>
        <p className={styles.formSubtitle}>
          Enter your credentials to access your studio dashboard, bookings, and galleries.
        </p>
      </header>

      <LoginForm />
    </div>
  );
}
