'use strict';

const CreateEventBookingUseCase = require('../CreateEventBookingUseCase');
const AppError = require('../../../errors/AppError');

describe('CreateEventBookingUseCase', () => {
  let useCase;
  let mockRepo;

  const validDto = {
    studioId: 'studio_1',
    clientName: 'John Client',
    clientEmail: 'client@test.com',
    eventDate: '2026-09-15',
    startTime: '10:00',
    endTime: '12:00',
    packageId: null,
    notes: '',
  };

  beforeEach(() => {
    mockRepo = {
      findAvailableSlots: jest.fn().mockResolvedValue([
        { startTime: '10:00', endTime: '12:00', status: 'available' },
        { startTime: '12:00', endTime: '14:00', status: 'available' },
      ]),
      findPackageById: jest.fn().mockResolvedValue(null),
      createBookingWithInvoice: jest.fn().mockResolvedValue({
        event: { id: 'event_1', status: 'requested' },
        payment: { id: 'pay_1', status: 'pending' },
      }),
    };
    useCase = new CreateEventBookingUseCase(mockRepo);
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw AppError 400 if required fields are missing', async () => {
    const dto = { studioId: 'studio_1' }; // missing clientName, email, date, startTime
    await expect(useCase.execute(dto)).rejects.toThrow(AppError);
    await expect(useCase.execute(dto)).rejects.toMatchObject({
      statusCode: 400,
      code: 'MISSING_REQUIRED_FIELDS',
    });
  });

  it('should throw AppError 409 if requested time slot is already booked', async () => {
    mockRepo.findAvailableSlots.mockResolvedValue([
      { startTime: '10:00', endTime: '12:00', status: 'booked' },
    ]);
    await expect(useCase.execute(validDto)).rejects.toThrow(AppError);
    await expect(useCase.execute(validDto)).rejects.toMatchObject({
      statusCode: 409,
      code: 'SLOT_NOT_AVAILABLE',
    });
  });

  it('should create booking successfully with no package', async () => {
    const result = await useCase.execute(validDto);
    expect(mockRepo.createBookingWithInvoice).toHaveBeenCalled();
    expect(result.event.status).toBe('requested');
    expect(result.payment.status).toBe('pending');
  });

  it('should resolve end time from package duration when packageId is provided', async () => {
    mockRepo.findPackageById.mockResolvedValue({
      id: 'pkg_1', title: 'Premium', price: 500, durationMinutes: 120,
    });

    const dto = { ...validDto, packageId: 'pkg_1', startTime: '10:00' };
    await useCase.execute(dto);

    const callArgs = mockRepo.createBookingWithInvoice.mock.calls[0];
    const eventEntity = callArgs[0];
    expect(eventEntity.endTime).toBe('12:00'); // 10:00 + 120 min = 12:00
    expect(eventEntity.price).toBe(500);
    expect(eventEntity.title).toBe('Premium');
  });

  it('should generate a pending invoice with minimum retainer for custom session', async () => {
    await useCase.execute(validDto); // No package = custom session
    const callArgs = mockRepo.createBookingWithInvoice.mock.calls[0];
    const paymentEntity = callArgs[1];
    expect(paymentEntity.amount).toBe(500); // Default minimum retainer
    expect(paymentEntity.status).toBe('pending');
  });
});
