const requireAdminRole = require('../requireAdminRole');
const AppError = require('../../../application/errors/AppError');

describe('requireAdminRole middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = { user: null, headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should throw AppError 401 if user is not authenticated', () => {
    requireAdminRole(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const err = mockNext.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Authentication required. Please log in.');
  });

  it('should throw AppError 403 if user is not an admin', () => {
    mockReq.user = { role: 'client', email: 'client@example.com' };
    requireAdminRole(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const err = mockNext.mock.calls[0][0];
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Access denied. Super Admin privileges required.');
  });

  it('should call next() and attach adminEmail if user is admin', () => {
    mockReq.user = { role: 'admin', email: 'admin@example.com' };
    requireAdminRole(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockReq.adminEmail).toBe('admin@example.com');
  });
});
