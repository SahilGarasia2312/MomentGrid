import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/styles/auth.module.css';

export const metadata = {
  title: 'Create Account — MomentGrid',
  description: 'Join MomentGrid as a studio owner, photographer, or client.',
};

export default function RegisterPage() {
  return (
    <div className="animate-fade-up">
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Join MomentGrid</h1>
        <p className={styles.formSubtitle}>
          Select your account role and get started with state-of-the-art photography management.
        </p>
      </header>

      <RegisterForm />
    </div>
  );
}
