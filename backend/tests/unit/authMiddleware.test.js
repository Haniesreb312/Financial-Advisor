const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/auth');
const { mockRequest, mockResponse, mockNext, getErrorMessage } = require('../helpers/testUtils');

describe('Auth Middleware', () => {
  it('should authenticate valid token', () => {
    const token = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET);
    const req = mockRequest({
      header: jest.fn().mockReturnValue(`Bearer ${token}`),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(req.userId).toBe('user-123');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should reject request without token', () => {
    const req = mockRequest({
      header: jest.fn().mockReturnValue(undefined),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    const error = getErrorMessage(res);
    expect(error).toBe('No authentication token, access denied');
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject invalid token', () => {
    const req = mockRequest({
      header: jest.fn().mockReturnValue('Bearer invalid-token'),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    const error = getErrorMessage(res);
    expect(error).toBe('Token is invalid or expired');
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject expired token', () => {
    const expiredToken = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET, { expiresIn: '-1h' });
    const req = mockRequest({
      header: jest.fn().mockReturnValue(`Bearer ${expiredToken}`),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle token without Bearer prefix', () => {
    const token = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET);
    const req = mockRequest({
      header: jest.fn().mockReturnValue(token),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    // Should fail because token doesn't have Bearer prefix
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should extract userId from valid token', () => {
    const userId = 'test-user-456';
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    const req = mockRequest({
      header: jest.fn().mockReturnValue(`Bearer ${token}`),
    });
    const res = mockResponse();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
  });
});
