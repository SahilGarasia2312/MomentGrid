'use strict';

const { validationResult } = require('express-validator');
const MongoUserRepository = require('../../infrastructure/database/repositories/MongoUserRepository');
const JwtService = require('../../infrastructure/services/JwtService');
const EmailService = require('../../infrastructure/services/EmailService');
const tokenBlacklist = require('../../infrastructure/services/TokenBlacklist');
const AppError = require('../../application/errors/AppError');

// Use cases
const RegisterUseCase = require('../../application/usecases/RegisterUseCase');
const LoginUseCase = require('../../application/usecases/LoginUseCase');
const ForgotPasswordUseCase = require('../../application/usecases/ForgotPasswordUseCase');
const ResetPasswordUseCase = require('../../application/usecases/ResetPasswordUseCase');
const VerifyEmailUseCase = require('../../application/usecases/VerifyEmailUseCase');
const RefreshTokenUseCase = require('../../application/usecases/RefreshTokenUseCase');
const LogoutUseCase = require('../../application/usecases/LogoutUseCase');

// DTOs
const {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
  RefreshTokenDTO,
  LogoutDTO,
} = require('../../application/dtos/AuthDTOs');

// ── Shared dependencies (composed once) ───────────────────────────────────
const userRepository = new MongoUserRepository();
const jwtService = new JwtService();

// ── Cookie helpers ─────────────────────────────────────────────────────────
const REFRESH_COOKIE = 'mg_refresh';
const cookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: rememberMe
    ? 30 * 24 * 60 * 60 * 1000   // 30 days
    : 7 * 24 * 60 * 60 * 1000,  // 7 days
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
});

/**
 * Helper — extract validation errors and throw AppError if any exist.
 */
const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * AuthController — Thin HTTP adapter.
 *
 * Responsibilities:
 *   1. Extract and validate HTTP input
 *   2. Build DTO and call use case
 *   3. Format HTTP response (status code, headers, body)
 *
 * Zero business logic here.
 */
class AuthController {
  // ── POST /auth/register ──────────────────────────────────────────────────
  static async register(req, res, next) {
    try {
      assertValid(req);

      const dto = new RegisterDTO(req.body);
      const result = await new RegisterUseCase(userRepository, jwtService, EmailService).execute(dto);

      res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions(false));

      return res.status(201).json({
        success: true,
        data: {
          user: result.user,
          access_token: result.accessToken,
          token_type: result.tokenType,
          expires_in: result.expiresIn,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ── POST /auth/login ─────────────────────────────────────────────────────
  static async login(req, res, next) {
    try {
      assertValid(req);

      const dto = new LoginDTO(req.body);
      const result = await new LoginUseCase(userRepository, jwtService).execute(dto);

      res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions(dto.rememberMe));

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          access_token: result.accessToken,
          token_type: result.tokenType,
          expires_in: result.expiresIn,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ── POST /auth/logout ────────────────────────────────────────────────────
  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE];
      const dto = new LogoutDTO({ refreshToken });
      await new LogoutUseCase(tokenBlacklist).execute(dto);

      res.clearCookie(REFRESH_COOKIE, clearCookieOptions());

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  // ── POST /auth/refresh ───────────────────────────────────────────────────
  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE];
      const dto = new RefreshTokenDTO({ refreshToken });
      const result = await new RefreshTokenUseCase(
        userRepository,
        jwtService,
        tokenBlacklist
      ).execute(dto);

      res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions(false));

      return res.status(200).json({
        success: true,
        data: {
          access_token: result.accessToken,
          token_type: result.tokenType,
          expires_in: result.expiresIn,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ── POST /auth/forgot-password ───────────────────────────────────────────
  static async forgotPassword(req, res, next) {
    try {
      assertValid(req);

      const dto = new ForgotPasswordDTO(req.body);
      await new ForgotPasswordUseCase(userRepository, EmailService).execute(dto);

      return res.status(200).json({
        success: true,
        data: {
          message: 'If an account exists with this email, a password reset link has been sent.',
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ── POST /auth/reset-password ────────────────────────────────────────────
  static async resetPassword(req, res, next) {
    try {
      assertValid(req);

      const dto = new ResetPasswordDTO(req.body);
      await new ResetPasswordUseCase(userRepository).execute(dto);

      return res.status(200).json({
        success: true,
        data: {
          message: 'Password reset successfully. Please log in with your new password.',
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ── GET /auth/verify-email?token=xxx ────────────────────────────────────
  static async verifyEmail(req, res, next) {
    try {
      assertValid(req);

      const dto = new VerifyEmailDTO({ token: req.query.token });
      const result = await new VerifyEmailUseCase(userRepository, EmailService).execute(dto);

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── GET /auth/me ─────────────────────────────────────────────────────────
  static async me(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found.', 404, 'RESOURCE_NOT_FOUND');
      }
      return res.status(200).json({ success: true, data: { user: user.toPublic() } });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
