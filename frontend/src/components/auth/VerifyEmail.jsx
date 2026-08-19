'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { authApi } from '@/lib/api/authApi';
import styles from '@/styles/auth.module.css';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the URL.');
      return;
    }

    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

    async function doVerify() {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.message || 'Email verification link is invalid or has expired.'
        );
      }
    }

    doVerify();
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className={styles.verifyScreen}>
        <div className={styles.verifySpinner} />
        <h3 className={styles.formTitle} style={{ fontSize: '22px' }}>
          Verifying your email...
        </h3>
        <p className={styles.formSubtitle}>
          Please hold on for a moment while we verify and activate your MomentGrid account.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={`${styles.successScreen} animate-fade-up`}>
        <div className={styles.successIcon}>
          <CheckCircle2 size={36} />
        </div>
        <h2 className={styles.successTitle}>Email Verified!</h2>
        <p className={styles.successSubtitle}>
          Thank you! Your email has been verified and your account is now fully active. You can start exploring MomentGrid right away.
        </p>
        <div style={{ marginTop: '24px' }}>
          <Link href="/login">
            <Button variant="primary">Sign In to Your Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.verifyScreen} animate-fade-up`}>
      <div
        className={styles.successIcon}
        style={{ background: 'var(--color-error-subtle)', color: 'var(--color-error)' }}
      >
        <AlertCircle size={36} />
      </div>
      <h2 className={styles.successTitle} style={{ color: 'var(--color-error)' }}>
        Verification Failed
      </h2>
      <p className={styles.successSubtitle} style={{ marginBottom: '20px' }}>
        {errorMessage}
      </p>
      <Alert variant="info" title="Need help?">
        If your verification link has expired, please log in with your email and password to request a fresh verification link.
      </Alert>
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <Link href="/login" style={{ flex: 1 }}>
          <Button variant="primary">Go to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
