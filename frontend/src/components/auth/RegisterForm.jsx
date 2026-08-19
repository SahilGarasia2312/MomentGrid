'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Camera,
  UserCheck,
  Check,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateForm } from '@/lib/utils/validation';
import styles from '@/styles/auth.module.css';

const ROLES = [
  {
    id: 'studio_owner',
    name: 'Studio Owner',
    desc: 'Manage photography studios, booking packages, and teams.',
    icon: Building2,
  },
  {
    id: 'photographer',
    name: 'Photographer',
    desc: 'Showcase portfolio, set availability calendar, and deliver client galleries.',
    icon: Camera,
  },
  {
    id: 'client',
    name: 'Client',
    desc: 'Book photography sessions, view photo proofs, and download albums.',
    icon: UserCheck,
  },
];

export default function RegisterForm() {
  const { register } = useAuth();

  const [step, setStep] = useState(1); // 1: Role, 2: Account Details, 3: Success notice
  const [formData, setFormData] = useState({
    role: 'studio_owner',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const { errors: fieldErrors } = validateForm(formData, { [name]: name });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.role) {
        setErrors({ role: 'Please choose an account type to proceed.' });
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateForm(formData, {
      fullName: 'fullName',
      email: 'email',
      phone: 'phone',
      password: 'password',
      confirmPassword: 'confirmPassword',
      role: 'role',
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
      });

      setStep(3); // Show verification notice
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please double check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {step !== 3 && (
        <div className={styles.stepIndicator}>
          <div className={styles.step}>
            <div
              className={`
                ${styles.stepNumber}
                ${step === 1 ? styles.active : ''}
                ${step > 1 ? styles.completed : ''}
              `.trim()}
            >
              {step > 1 ? <Check size={16} /> : '1'}
            </div>
            <span className={`${styles.stepLabel} ${step === 1 ? styles.active : ''}`.trim()}>
              Select Role
            </span>
          </div>

          <div className={`${styles.stepConnector} ${step > 1 ? styles.completed : ''}`.trim()} />

          <div className={styles.step}>
            <div
              className={`
                ${styles.stepNumber}
                ${step === 2 ? styles.active : ''}
                ${step > 2 ? styles.completed : ''}
              `.trim()}
            >
              {step > 2 ? <Check size={16} /> : '2'}
            </div>
            <span className={`${styles.stepLabel} ${step === 2 ? styles.active : ''}`.trim()}>
              Account Details
            </span>
          </div>
        </div>
      )}

      <Alert variant="error" message={apiError} />

      {/* STEP 1: ROLE SELECTION */}
      {step === 1 && (
        <div className="animate-fade-in">
          <div className={styles.roleGrid}>
            {ROLES.map((r) => {
              const IconComp = r.icon;
              const isSelected = formData.role === r.id;
              return (
                <div
                  key={r.id}
                  className={`${styles.roleCard} ${isSelected ? styles.selected : ''}`.trim()}
                  onClick={() => handleRoleSelect(r.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleRoleSelect(r.id);
                  }}
                >
                  <div className={styles.roleIcon}>
                    <IconComp size={24} />
                  </div>
                  <div className={styles.roleName}>{r.name}</div>
                  <div className={styles.roleDesc}>{r.desc}</div>
                  {isSelected && (
                    <div className={styles.selectedBadge}>
                      <Check size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.role && (
            <Alert variant="error" message={errors.role} className="margin-bottom-4" />
          )}

          <Button variant="primary" onClick={nextStep}>
            <span>Continue to Details</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      )}

      {/* STEP 2: ACCOUNT DETAILS */}
      {step === 2 && (
        <form onSubmit={handleSubmit} noValidate className="animate-fade-in">
          <div className={styles.fieldGroup}>
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              placeholder="e.g. Alex Morgan"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              icon={User}
              required
            />

            <div className={styles.fieldRow}>
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="alex@studio.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Phone Number (Optional)"
                id="phone"
                name="phone"
                type="tel"
                placeholder="+14155552671"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                icon={Phone}
              />
            </div>

            <div>
              <Input
                label="Create Password"
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
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              icon={Lock}
              required
            />
          </div>

          <div className="display-flex gap-12" style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={prevStep} style={{ width: '120px' }}>
              <ArrowLeft size={18} />
              <span>Back</span>
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} style={{ flex: 1 }}>
              <span>Complete Registration</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS & EMAIL NOTICE */}
      {step === 3 && (
        <div className={`${styles.successScreen} animate-fade-up`}>
          <div className={styles.successIcon}>
            <Mail size={36} />
          </div>
          <h2 className={styles.successTitle}>Check your inbox!</h2>
          <p className={styles.successSubtitle}>
            We sent a verification link to <strong>{formData.email}</strong>.<br />
            Please click the link in the email to verify your address and activate your account.
          </p>
          <Alert variant="info" title="Development Note">
            Since this is running in dev mode (`Ethereal Email`), check your backend console logs for the direct email preview URL!
          </Alert>
          <div style={{ marginTop: '24px' }}>
            <Link href="/login">
              <Button variant="secondary">Go to Login Page</Button>
            </Link>
          </div>
        </div>
      )}

      {step !== 3 && (
        <div className={styles.authFooter}>
          Already have an account?{' '}
          <Link href="/login">Sign in here</Link>
        </div>
      )}
    </div>
  );
}
