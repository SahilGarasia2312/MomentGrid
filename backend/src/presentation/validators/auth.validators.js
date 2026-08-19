'use strict';

const { body, query } = require('express-validator');

/**
 * PASSWORD_REGEX — Requires: min 8 chars, 1 uppercase, 1 number, 1 special char.
 */
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

/**
 * VALID_ROLES — Acceptable roles for registration.
 */
const VALID_ROLES = ['studio_owner', 'photographer', 'client'];

/**
 * registerValidator — Validates POST /auth/register body.
 */
const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters.')
    .matches(/^[a-zA-Z\s'\-\.]+$/).withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(PASSWORD_REGEX).withMessage('Password must contain at least one uppercase letter, one number, and one special character.'),

  body('confirmPassword')
    .notEmpty().withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  body('role')
    .notEmpty().withMessage('Role is required.')
    .isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}.`),

  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\+[1-9]\d{7,14}$/).withMessage('Phone must be in E.164 format (e.g., +14155552671).'),
];

/**
 * loginValidator — Validates POST /auth/login body.
 */
const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),

  body('rememberMe')
    .optional()
    .isBoolean().withMessage('rememberMe must be a boolean.'),
];

/**
 * forgotPasswordValidator — Validates POST /auth/forgot-password body.
 */
const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

/**
 * resetPasswordValidator — Validates POST /auth/reset-password body.
 */
const resetPasswordValidator = [
  body('token')
    .trim()
    .notEmpty().withMessage('Reset token is required.'),

  body('password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(PASSWORD_REGEX).withMessage('Password must contain at least one uppercase letter, one number, and one special character.'),

  body('confirmPassword')
    .notEmpty().withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

/**
 * verifyEmailValidator — Validates GET /auth/verify-email?token=...
 */
const verifyEmailValidator = [
  query('token')
    .trim()
    .notEmpty().withMessage('Verification token is required.'),
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
};
