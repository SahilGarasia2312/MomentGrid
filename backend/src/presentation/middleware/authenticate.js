'use strict';

const JwtService = require('../../infrastructure/services/JwtService');
const MongoUserRepository = require('../../infrastructure/database/repositories/MongoUserRepository');
const AppError = require('../../application/errors/AppError');

const jwtService = new JwtService();
const userRepository = new MongoUserRepository();

/**
 * authenticate — JWT verification middleware.
 *
 * Extracts Bearer token from Authorization header,
 * verifies signature, loads user from DB,
 * and attaches req.user for downstream handlers.
 *
 * Usage:
 *   router.get('/protected', authenticate, controller.method)
 */
const authenticate = async (req, _res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authentication required. Please include a valid Bearer token.',
        401,
        'AUTHENTICATION_REQUIRED'
      );
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify JWT
    let payload;
    try {
      payload = jwtService.verifyAccessToken(token);
    } catch (jwtErr) {
      const code =
        jwtErr.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'AUTHENTICATION_REQUIRED';
      throw new AppError(
        jwtErr.name === 'TokenExpiredError'
          ? 'Access token has expired. Please refresh your session.'
          : 'Invalid access token.',
        401,
        code
      );
    }

    // 3. Load fresh user from DB (ensures suspended/deleted users are rejected)
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError('User account not found.', 401, 'AUTHENTICATION_REQUIRED');
    }
    if (!user.canLogin()) {
      throw new AppError(
        'Your account has been suspended.',
        403,
        'ACCOUNT_SUSPENDED'
      );
    }

    // 4. Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      studioId: user.studioId,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
