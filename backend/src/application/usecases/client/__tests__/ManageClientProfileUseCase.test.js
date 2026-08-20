'use strict';

const ManageClientProfileUseCase = require('../ManageClientProfileUseCase');
const AppError = require('../../../errors/AppError');

describe('ManageClientProfileUseCase', () => {
  let useCase;
  let mockUserRepo;
  let mockUser;

  beforeEach(() => {
    mockUser = {
      id: 'user_123',
      email: 'client@test.com',
      fullName: 'Client Test',
      phone: '1234567890',
      role: 'client',
      status: 'active',
      notificationPreferences: { email: true, sms: false, push: false },
      shippingAddress: { street: '123 Main', city: 'NY', state: 'NY', zip: '10001', country: 'US' },
    };

    mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockImplementation(async (user) => user),
    };

    useCase = new ManageClientProfileUseCase(mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should throw AppError if no email provided', async () => {
      await expect(useCase.getProfile({})).rejects.toThrow(AppError);
      await expect(useCase.getProfile({})).rejects.toMatchObject({
        statusCode: 400,
        code: 'CLIENT_EMAIL_REQUIRED',
      });
    });

    it('should return virtual profile if user is not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      const result = await useCase.getProfile({ clientEmail: 'virtual@test.com' });
      expect(result.email).toBe('virtual@test.com');
      expect(result.fullName).toBe('virtual');
    });

    it('should return exact profile if user exists', async () => {
      const result = await useCase.getProfile({ clientEmail: 'client@test.com' });
      expect(result.id).toBe('user_123');
      expect(result.notificationPreferences.sms).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should throw AppError if no email provided', async () => {
      await expect(useCase.updateProfile({ fullName: 'test' })).rejects.toThrow(AppError);
    });

    it('should throw AppError if user does not exist', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      await expect(useCase.updateProfile({ clientEmail: 'none@test.com', fullName: 'test' })).rejects.toThrow(AppError);
    });

    it('should successfully update user profile', async () => {
      const updateData = {
        clientEmail: 'client@test.com',
        fullName: 'New Name',
        phone: '0987654321',
      };
      const result = await useCase.updateProfile(updateData);
      expect(mockUserRepo.update).toHaveBeenCalled();
      expect(result.fullName).toBe('New Name');
      expect(result.phone).toBe('0987654321');
    });
  });
});
