const jwt = require('jsonwebtoken');

/**
 * Generate a test JWT token
 */
function generateTestToken(userId = 'user-123-test-id') {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Create mock request object
 */
function mockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    header: jest.fn(),
    userId: null,
    ...overrides,
  };
}

/**
 * Create mock response object
 */
function mockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Create mock next function
 */
function mockNext() {
  return jest.fn();
}

/**
 * Extract error message from response
 */
function getErrorMessage(res) {
  return res.json.mock.calls[0]?.[0]?.error || null;
}

/**
 * Extract success data from response
 */
function getResponseData(res) {
  return res.json.mock.calls[0]?.[0] || null;
}

module.exports = {
  generateTestToken,
  mockRequest,
  mockResponse,
  mockNext,
  getErrorMessage,
  getResponseData,
};
