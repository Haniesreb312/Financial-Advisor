# Backend Tests

Comprehensive test suite for WealthWise Advisors backend API.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode (for development)
npm run test:watch
```

## Test Organization

### Directory Structure

```
tests/
├── setup.js                       # Global test configuration
├── helpers/                       # Test utilities
│   ├── mockData.js               # Mock database records
│   └── testUtils.js              # Helper functions
├── unit/                          # Unit tests (isolated)
│   ├── authController.test.js    # Auth business logic
│   ├── portfolioController.test.js
│   ├── budgetController.test.js
│   └── authMiddleware.test.js    # JWT middleware
└── integration/                   # Integration tests (API)
    ├── auth.test.js              # Auth endpoints
    ├── portfolio.test.js         # Portfolio endpoints
    └── budget.test.js            # Budget endpoints
```

## Test Categories

### Unit Tests (tests/unit/)

Test individual components in isolation.

**What's tested:**
- Controller functions
- Middleware logic
- Helper utilities
- Business logic
- Error handling

**Example:**
```javascript
describe('authController.register', () => {
  it('should hash password before saving', async () => {
    // Test just the password hashing logic
  });
});
```

**Run:**
```bash
npm run test:unit
```

### Integration Tests (tests/integration/)

Test complete API workflows.

**What's tested:**
- HTTP endpoints
- Request/response cycle
- Authentication flow
- Validation rules
- Status codes
- Error responses

**Example:**
```javascript
describe('POST /api/auth/register', () => {
  it('should register user and return token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'pass123' });
    
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });
});
```

**Run:**
```bash
npm run test:integration
```

## Running Tests

### Basic Commands

```bash
# All tests
npm test

# All tests with coverage
npm test -- --coverage

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode (re-runs on file changes)
npm run test:watch

# Specific test file
npm test -- authController.test.js

# Tests matching pattern
npm test -- -t "should register"

# Verbose output
npm test -- --verbose
```

### Using the Test Script

```bash
# Make executable
chmod +x test.sh

# Run all tests
./test.sh

# Run specific category
./test.sh unit
./test.sh integration

# Run with coverage and open report
./test.sh coverage

# Watch mode
./test.sh watch

# Quick run (no coverage)
./test.sh quick

# Help
./test.sh help
```

## Test Coverage

### Viewing Coverage

After running tests with `--coverage`:

```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Coverage Goals

| Metric | Target | Critical Paths |
|--------|--------|----------------|
| Statements | 80%+ | 95%+ |
| Branches | 75%+ | 90%+ |
| Functions | 80%+ | 95%+ |
| Lines | 80%+ | 95%+ |

**Critical Paths:**
- Authentication (login, register, JWT)
- Authorization (middleware)
- Data validation
- Error handling

### Coverage Report

```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   85.2  |   78.4   |   88.1  |   85.6  |
 controllers/    |   87.5  |   81.2   |   90.3  |   88.1  |
  authController |   92.1  |   88.5   |   95.0  |   93.2  |
 middleware/     |   90.5  |   85.3   |   92.1  |   91.2  |
  auth          |   95.2  |   90.1   |   100   |   96.3  |
-----------------|---------|----------|---------|---------|
```

## Mock Data

### Available Mocks

Located in `tests/helpers/mockData.js`:

```javascript
const { 
  mockUser,              // Complete user with password hash
  mockUserWithoutPassword, // User without sensitive data
  mockPortfolio,         // Portfolio data
  mockBudget,            // Budget data
  mockRetirementPlan,    // Retirement plan
  mockActivity           // Activity log
} = require('./helpers/mockData');
```

### Using Mocks

```javascript
it('should return user', async () => {
  // Setup mock
  prisma.user.findUnique.mockResolvedValue(mockUser);
  
  // Call function
  await controller.getUser(req, res);
  
  // Assert
  expect(res.json).toHaveBeenCalledWith({ user: mockUser });
});
```

## Test Utilities

### Available Utilities

From `tests/helpers/testUtils.js`:

```javascript
const {
  generateTestToken,    // Create JWT for testing
  mockRequest,          // Mock Express req
  mockResponse,         // Mock Express res
  mockNext,             // Mock Express next
  getErrorMessage,      // Extract error from res
  getResponseData       // Extract data from res
} = require('./helpers/testUtils');
```

### Usage Examples

#### mockRequest
```javascript
const req = mockRequest({
  body: { name: 'Test' },
  params: { id: '123' },
  query: { search: 'term' },
  userId: 'user-123'
});
```

#### mockResponse
```javascript
const res = mockResponse();

await controller.someMethod(req, res);

expect(res.status).toHaveBeenCalledWith(200);
expect(res.json).toHaveBeenCalled();

const data = getResponseData(res);
expect(data.message).toBe('Success');
```

#### generateTestToken
```javascript
const token = generateTestToken('user-id-123');

const response = await request(app)
  .get('/api/protected')
  .set('Authorization', `Bearer ${token}`);
```

## Writing New Tests

### Test Template

```javascript
const { PrismaClient } = require('@prisma/client');
const controller = require('../../controllers/yourController');
const { mockRequest, mockResponse, getResponseData } = require('../helpers/testUtils');

const prisma = new PrismaClient();

describe('YourController', () => {
  describe('methodName', () => {
    let req, res;
    
    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
    });
    
    it('should do something successfully', async () => {
      // Arrange
      prisma.model.method.mockResolvedValue(mockData);
      
      // Act
      await controller.methodName(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      const data = getResponseData(res);
      expect(data).toBeDefined();
    });
    
    it('should handle errors', async () => {
      // Arrange
      prisma.model.method.mockRejectedValue(new Error('DB Error'));
      
      // Act
      await controller.methodName(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
```

### Checklist for New Tests

- [ ] Test file named `*.test.js`
- [ ] Tests grouped with `describe()`
- [ ] Descriptive test names with `it()`
- [ ] Uses Arrange-Act-Assert pattern
- [ ] Tests success cases
- [ ] Tests error cases
- [ ] Tests edge cases
- [ ] Mocks database calls
- [ ] No hardcoded values
- [ ] Clean and readable

## Common Patterns

### Testing Authenticated Endpoints

```javascript
it('should require authentication', async () => {
  const token = generateTestToken();
  
  const response = await request(app)
    .get('/api/protected')
    .set('Authorization', `Bearer ${token}`);
  
  expect(response.status).toBe(200);
});

it('should reject without token', async () => {
  const response = await request(app)
    .get('/api/protected');
  
  expect(response.status).toBe(401);
});
```

### Testing Validation

```javascript
it('should validate required fields', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({ incomplete: 'data' });
  
  expect(response.status).toBe(400);
});
```

### Testing Database Operations

```javascript
it('should create record in database', async () => {
  prisma.model.create.mockResolvedValue(mockData);
  
  await controller.create(req, res);
  
  expect(prisma.model.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      field: 'value'
    })
  });
});
```

## Debugging Tests

### Run in Debug Mode

```bash
# Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome
```

### Add Console Output

```javascript
it('test name', () => {
  console.log('Debug:', variable);
  expect(variable).toBe('value');
});
```

### Skip/Focus Tests

```javascript
// Skip
it.skip('skipped test', () => { /* ... */ });
describe.skip('skipped suite', () => { /* ... */ });

// Only run this test
it.only('focused test', () => { /* ... */ });
describe.only('focused suite', () => { /* ... */ });
```

## Continuous Integration

Tests run automatically on:
- Push to main/develop
- Pull requests
- Manual workflow trigger

See `.github/workflows/backend-tests.yml`

### CI Test Results

GitHub Actions will:
1. Run all tests
2. Generate coverage
3. Upload to Codecov
4. Comment on PRs with results
5. Block merge if tests fail

## Troubleshooting

### Tests Hanging

**Problem:** Tests don't complete

**Solution:**
- Ensure async functions use `await`
- Check for unresolved promises
- Increase timeout: `jest.setTimeout(10000)`

### Mock Not Working

**Problem:** Real database being called

**Solution:**
- Verify mock in `tests/setup.js`
- Clear mocks: `jest.clearAllMocks()`
- Check import path

### Token Errors

**Problem:** JWT errors in tests

**Solution:**
- Verify `JWT_SECRET` in setup
- Use `generateTestToken()` utility
- Check token format: `Bearer <token>`

### Random Failures

**Problem:** Tests pass/fail inconsistently

**Solution:**
- Make tests isolated
- Don't depend on execution order
- Clear state between tests

## Best Practices

### DO ✅

- Write tests for new features
- Test edge cases and errors
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Run tests before committing
- Maintain >80% coverage

### DON'T ❌

- Test implementation details
- Write flaky tests
- Depend on test execution order
- Use real database in tests
- Skip error case testing
- Commit without running tests
- Test third-party code

## Resources

- [Full Testing Guide](../TESTING.md)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Docs](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Need Help?

1. Check TESTING.md for detailed guide
2. Review existing test examples
3. Run `./test.sh help`
4. Ask in team chat
5. Open GitHub issue
