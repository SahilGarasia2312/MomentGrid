'use strict';

const UpdateUserStatusUseCase = require('../UpdateUserStatusUseCase');
const AppError = require('../../../errors/AppError');

jest.mock('../../../../infrastructure/database/models/UserModel', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
const UserModel = require('../../../../infrastructure/database/models/UserModel');

jest.mock('../../../../infrastructure/admin/AdminActivityLogger', () => ({
  log: jest.fn(),
}));
const adminActivityLogger = require('../../../../infrastructure/admin/AdminActivityLogger');

describe('UpdateUserStatusUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new UpdateUserStatusUseCase();
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if userId is missing', async () => {
    await expect(useCase.execute({ status: 'active' })).rejects.toThrow(AppError);
  });

  it('should throw if neither status nor role is provided', async () => {
    await expect(useCase.execute({ userId: 'u1' })).rejects.toThrow(AppError);
  });

  it('should throw if user not found', async () => {
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    await expect(useCase.execute({ userId: 'u1', status: 'active' })).rejects.toThrow(AppError);
  });

  it('should throw on invalid status', async () => {
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: 'u1' }) });
    await expect(useCase.execute({ userId: 'u1', status: 'invalid_status' })).rejects.toThrow(AppError);
  });

  it('should successfully update status and log activity', async () => {
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: 'u1', email: 'test@test.com' }) });
    UserModel.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: 'u1', status: 'suspended', role: 'client' })
      })
    });

    const result = await useCase.execute({ userId: 'u1', status: 'suspended' });
    expect(result.status).toBe('suspended');
    expect(adminActivityLogger.log).toHaveBeenCalledWith(expect.objectContaining({
      type: 'user_update',
      action: 'Changed status to "suspended" for user test@test.com'
    }));
  });
});
