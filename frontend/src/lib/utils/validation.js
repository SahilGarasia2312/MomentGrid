'use client';

/**
 * PASSWORD_REGEX — Requires: min 8 chars, 1 uppercase, 1 number, 1 special char.
 */
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

/**
 * E164_PHONE_REGEX — International phone number verification (e.g. +14155552671).
 */
export const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

/**
 * EMAIL_REGEX — Standard basic email pattern check.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation helper functions for client-side forms.
 * Each returns string error message if invalid, or null if valid.
 */
export const validators = {
  fullName: (value) => {
    if (!value || !value.trim()) return 'Full name is required.';
    if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
    if (value.trim().length > 100) return 'Full name cannot exceed 100 characters.';
    if (!/^[a-zA-Z\s'\-\.]+$/.test(value.trim())) {
      return "Full name can only contain letters, spaces, hyphens, and apostrophes.";
    }
    return null;
  },

  email: (value) => {
    if (!value || !value.trim()) return 'Email address is required.';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters long.';
    if (!PASSWORD_REGEX.test(value)) {
      return 'Must include 1 uppercase letter, 1 number, and 1 special character.';
    }
    return null;
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password.';
    if (value !== password) return 'Passwords do not match.';
    return null;
  },

  role: (value) => {
    const validRoles = ['studio_owner', 'photographer', 'client'];
    if (!value) return 'Please select a role to continue.';
    if (!validRoles.includes(value)) return 'Invalid role selected.';
    return null;
  },

  phone: (value) => {
    if (!value || !value.trim()) return null; // phone is optional
    if (!E164_PHONE_REGEX.test(value.trim())) {
      return 'Phone must be in international E.164 format (e.g., +14155552671).';
    }
    return null;
  },

  token: (value) => {
    if (!value || !value.trim()) return 'Token is required.';
    return null;
  },
};

/**
 * Validate an entire object of values against specified validator keys.
 * Returns { isValid: boolean, errors: { [field]: string } }
 */
export function validateForm(values, rules = {}) {
  const errors = {};
  let isValid = true;

  for (const [field, validatorNameOrFn] of Object.entries(rules)) {
    let error = null;
    if (typeof validatorNameOrFn === 'function') {
      error = validatorNameOrFn(values[field], values);
    } else if (validators[validatorNameOrFn]) {
      if (validatorNameOrFn === 'confirmPassword') {
        error = validators.confirmPassword(values[field], values.password);
      } else {
        error = validators[validatorNameOrFn](values[field]);
      }
    }

    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Calculate password strength score (0 to 4).
 */
export function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', className: '' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', className: 'weak' };
    case 2:
      return { score: 2, label: 'Fair', className: 'fair' };
    case 3:
      return { score: 3, label: 'Good', className: 'good' };
    case 4:
      return { score: 4, label: 'Strong', className: 'strong' };
    default:
      return { score: 0, label: 'Too short', className: 'weak' };
  }
}
