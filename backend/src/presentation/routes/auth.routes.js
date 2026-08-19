'use strict';

const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authenticate = require('../middleware/authenticate');
const { authLimiter, refreshLimiter, generalLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} = require('../validators/auth.validators');

const router = Router();

// ── Public Auth Routes ─────────────────────────────────────────────────────

/** POST /v1/auth/register */
router.post('/register', authLimiter, registerValidator, AuthController.register);

/** POST /v1/auth/login */
router.post('/login', authLimiter, loginValidator, AuthController.login);

/** POST /v1/auth/logout */
router.post('/logout', AuthController.logout);

/** POST /v1/auth/refresh — reads httpOnly cookie */
router.post('/refresh', refreshLimiter, AuthController.refresh);

/** POST /v1/auth/forgot-password */
router.post('/forgot-password', authLimiter, forgotPasswordValidator, AuthController.forgotPassword);

/** POST /v1/auth/reset-password */
router.post('/reset-password', generalLimiter, resetPasswordValidator, AuthController.resetPassword);

/** GET /v1/auth/verify-email?token=xxx */
router.get('/verify-email', generalLimiter, verifyEmailValidator, AuthController.verifyEmail);

// ── Protected Auth Routes ──────────────────────────────────────────────────

/** GET /v1/auth/me — requires valid access token */
router.get('/me', authenticate, AuthController.me);

module.exports = router;
