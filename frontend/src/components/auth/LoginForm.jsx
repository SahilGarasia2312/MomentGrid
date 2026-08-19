'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateForm } from '@/lib/utils/validation';
import { getRoleDashboardPath } from '@/lib/utils/roleRouting';
import styles from '@/styles/auth.module.css';

export default function LoginForm() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.replace(getRoleDashboardPath(user.role));
    }
  }, [authLoading, isAuthenticated, user, router]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'email' || name === 'password') {
      const { errors: fieldErrors } = validateForm(formData, { [name]: name });
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateForm(formData, {
      email: 'email',
      password: (val) => (!val ? 'Password is required.' : null),
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (res?.user) {
        const destination = getRoleDashboardPath(res.user.role);
        router.push(destination);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Alert variant="error" message={apiError} />

      <div className={styles.fieldGroup}>
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="e.g. alex@studio.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          icon={Mail}
          required
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          icon={Lock}
          required
        />
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Remember me for 30 days</span>
        </label>

        <Link href="/forgot-password" className={styles.forgotLink}>
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        <span>Sign In to MomentGrid</span>
        <ArrowRight size={18} />
      </Button>

      <div className={styles.authFooter}>
        Don&apos;t have an account yet?{' '}
        <Link href="/register">Create an account</Link>
      </div>
    </form>
  );
}
