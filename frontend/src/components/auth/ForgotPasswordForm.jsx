'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { authApi } from '@/lib/api/authApi';
import { validateForm } from '@/lib/utils/validation';
import styles from '@/styles/auth.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateForm(
      { email },
      { email: 'email' }
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || 'Something went wrong while sending the reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${styles.successScreen} animate-fade-up`}>
        <div className={styles.successIcon}>
          <CheckCircle2 size={36} />
        </div>
        <h2 className={styles.successTitle}>Check your inbox</h2>
        <p className={styles.successSubtitle}>
          If an account exists for <strong>{email}</strong>, we have sent a password reset link.
          Please check your inbox and spam folder.
        </p>
        <Alert variant="info" title="Development Note">
          In dev mode (`Ethereal Email`), check your backend console terminal to click the reset link directly!
        </Alert>
        <div style={{ marginTop: '24px' }}>
          <Link href="/login">
            <Button variant="secondary">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Alert variant="error" message={apiError} />

      <div className={styles.fieldGroup}>
        <Input
          label="Registered Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="alex@studio.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({});
            if (apiError) setApiError(null);
          }}
          error={errors.email}
          icon={Mail}
          required
        />
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        <span>Send Reset Link</span>
        <ArrowRight size={18} />
      </Button>

      <div style={{ marginTop: '20px' }}>
        <Link href="/login">
          <Button variant="ghost">
            <ArrowLeft size={18} />
            <span>Back to Sign In</span>
          </Button>
        </Link>
      </div>
    </form>
  );
}
