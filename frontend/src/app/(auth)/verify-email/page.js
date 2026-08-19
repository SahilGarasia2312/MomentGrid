import React, { Suspense } from 'react';
import VerifyEmail from '@/components/auth/VerifyEmail';
import styles from '@/styles/auth.module.css';

export const metadata = {
  title: 'Verify Email Address — MomentGrid',
  description: 'Verifying your email address to activate your MomentGrid account.',
};

export default function VerifyEmailPage() {
  return (
    <div className="animate-fade-up">
      <Suspense fallback={<div className={styles.verifySpinner} />}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
