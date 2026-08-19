'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { authApi } from '@/lib/api/authApi';
import { validateForm } from '@/lib/utils/validation';
import styles from '@/styles/auth.module.css';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token && !isSuccess) {
    return (
      <div className={styles.verifyScreen}>
        <Alert variant="error" title="Missing Token">
          No password reset token found in the URL. Please ensure you clicked the exact link sent to your email.
        </Alert>
        <Link href="/forgot-password" style={{ display: 'inline-block', marginTop: '16px' }}>
          <Button variant="secondary">Request New Link</Button>
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const { errors: fieldErrors } = validateForm(formData, { [name]: name });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateForm(formData, {
      password: 'password',
      confirmPassword: 'confirmPassword',
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setIsSuccess(true);
    } catch (err) {
      setApiError(
        err.message || 'Password reset failed. Your link may have expired or already been used.'
      );
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
        <h2 className={styles.successTitle}>Password Reset!</h2>
        <p className={styles.successSubtitle}>
          Your password has been successfully updated. You can now log into your MomentGrid account using your new credentials.
        </p>
        <div style={{ marginTop: '24px' }}>
          <Link href="/login">
            <Button variant="primary">Sign In Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Alert variant="error" message={apiError} />

      <div className={styles.fieldGroup}>
        <div>
          <Input
            label="New Password"
            id="password"
            name="password"
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 symbol"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            icon={Lock}
            required
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Input
          label="Confirm New Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          icon={Lock}
          required
        />
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        <span>Update Password</span>
        <ArrowRight size={18} />
      </Button>
    </form>
  );
}
