'use strict';

const LoginUseCase = require('../LoginUseCase');
const AppError = require('../../errors/AppError');
const bcrypt = require('bcryptjs');
const { LoginDTO } = require('../../dtos/AuthDTOs');

jest.mock('bcryptjs');

describe('LoginUseCase', () => {
  let loginUseCase;
  let mockUserRepository;
  let mockJwtService;
  let mockUser;

  beforeEach(() => {
    mockUser = {
      id: 'user123',
      role: 'client',
      emailVerified: true,
      studioId: null,
      passwordHash: 'hashed_password',
      isSuspended: jest.fn().mockReturnValue(false),
      isEmailVerified: jest.fn().mockReturnValue(true),
      recordLogin: jest.fn(),
      toPublic: jest.fn().mockReturnValue({ id: 'user123', email: 'test@test.com' }),
    };

    mockUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(),
    };

    mockJwtService = {
      signAccessToken: jest.fn().mockReturnValue('access_token'),
      signRefreshToken: jest.fn().mockReturnValue('refresh_token'),
    };

    loginUseCase = new LoginUseCase(mockUserRepository, mockJwtService);
    bcrypt.compare.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw AppError 401 if user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);

    const dto = new LoginDTO({ email: 'wrong@test.com', password: 'password' });

    await expect(loginUseCase.execute(dto)).rejects.toThrow(AppError);
    await expect(loginUseCase.execute(dto)).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('should throw AppError 401 if password does not match', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const dto = new LoginDTO({ email: 'test@test.com', password: 'wrongpassword' });

    await expect(loginUseCase.execute(dto)).rejects.toThrow(AppError);
  });

  it('should throw AppError 403 if account is suspended', async () => {
    mockUser.isSuspended.mockReturnValue(true);

    const dto = new LoginDTO({ email: 'test@test.com', password: 'password' });

    await expect(loginUseCase.execute(dto)).rejects.toThrow(AppError);
    await expect(loginUseCase.execute(dto)).rejects.toMatchObject({
      statusCode: 403,
      code: 'ACCOUNT_SUSPENDED',
    });
  });

  it('should throw AppError 403 if email is not verified', async () => {
    mockUser.isEmailVerified.mockReturnValue(false);

    const dto = new LoginDTO({ email: 'test@test.com', password: 'password' });

    await expect(loginUseCase.execute(dto)).rejects.toThrow(AppError);
    await expect(loginUseCase.execute(dto)).rejects.toMatchObject({
      statusCode: 403,
      code: 'EMAIL_NOT_VERIFIED',
    });
  });

  it('should successfully login and return tokens', async () => {
    const dto = new LoginDTO({ email: 'test@test.com', password: 'password' });
    const result = await loginUseCase.execute(dto);

    expect(mockUser.recordLogin).toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    expect(mockJwtService.signAccessToken).toHaveBeenCalled();
    expect(mockJwtService.signRefreshToken).toHaveBeenCalled();

    expect(result.accessToken).toBe('access_token');
    expect(result.refreshToken).toBe('refresh_token');
    expect(result.user).toEqual({ id: 'user123', email: 'test@test.com' });
  });
});
