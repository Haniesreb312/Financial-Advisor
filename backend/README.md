# Backend API Documentation

## Overview

Node.js/Express REST API for WealthWise Advisors financial platform.

## Technology Stack

- **Express.js** - Web framework
- **Prisma** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Project Structure

```
backend/
├── config/
│   └── database.js         # Prisma client configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── portfolioController.js
│   ├── budgetController.js
│   └── retirementController.js
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── auth.js             # Auth routes
│   ├── portfolio.js        # Portfolio routes
│   ├── budget.js           # Budget routes
│   └── retirement.js       # Retirement routes
├── tests/                  # Test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── helpers/           # Test utilities
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Example environment file
├── .env.test               # Test environment variables
├── package.json
├── server.js               # Express server entry point
├── TESTING.md              # Complete testing guide
└── test.sh                 # Test runner script
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/wealthwise_db"
JWT_SECRET="your-super-secret-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 5. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode (for development)
npm run test:watch

# Using test script
chmod +x test.sh
./test.sh              # Run all tests
./test.sh coverage     # Run with coverage report
./test.sh watch        # Watch mode
```

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

#### GET /api/auth/me
Get current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0100",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "occupation": "Engineer"
  }
}
```

#### PUT /api/auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Smith",
  "phone": "555-0100",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01",
  "occupation": "Engineer"
}
```

### Portfolio

#### GET /api/portfolio
Get user's portfolio (requires authentication).

**Response:**
```json
{
  "portfolio": {
    "id": "uuid",
    "stocks": 28125,
    "bonds": 15625,
    "realEstate": 12500,
    "cash": 6250,
    "totalInvested": 55000
  }
}
```

#### PUT /api/portfolio
Update portfolio (requires authentication).

**Request:**
```json
{
  "stocks": 30000,
  "bonds": 15000,
  "realEstate": 12000,
  "cash": 8000,
  "totalInvested": 60000
}
```

### Budget

#### GET /api/budget
Get all budgets for user (last 12 months).

#### GET /api/budget/current
Get current month's budget.

#### POST /api/budget
Create or update budget.

**Request:**
```json
{
  "month": 11,
  "year": 2024,
  "monthlyIncome": 5000,
  "housing": 1500,
  "utilities": 200,
  "food": 400,
  "transportation": 300,
  "insurance": 200,
  "entertainment": 150,
  "other": 250
}
```

#### DELETE /api/budget/:month/:year
Delete specific budget.

### Retirement Planning

#### GET /api/retirement
Get all retirement plans.

#### POST /api/retirement
Create retirement plan.

**Request:**
```json
{
  "currentAge": 30,
  "retirementAge": 65,
  "currentSavings": 50000,
  "monthlyContribution": 500,
  "expectedReturn": 7,
  "retirementGoal": 1000000
}
```

#### PUT /api/retirement/:id
Update retirement plan.

#### DELETE /api/retirement/:id
Delete retirement plan.

## Authentication

### JWT Token

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Tokens expire after 7 days. After expiration, user must login again.

### Password Security

- Passwords are hashed using bcrypt with cost factor 10
- Plain text passwords are never stored
- Minimum password length: 6 characters

## Error Handling

### Error Response Format

```json
{
  "error": "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `500` - Internal Server Error

### Common Errors

#### 401 Unauthorized
```json
{
  "error": "No authentication token, access denied"
}
```

#### 400 Validation Error
```json
{
  "error": "Valid email is required"
}
```

## Database Schema

See `/database/schema.prisma` for complete schema.

Key models:
- User
- Portfolio
- Budget
- RetirementPlan
- Investment
- SavingsGoal
- Activity

## Validation

Input validation using express-validator:

```javascript
const registerValidation = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];
```

## CORS Configuration

CORS is enabled for the frontend URL specified in `.env`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Logging

Development mode logs:
- All SQL queries
- Request method and path
- Errors with stack traces

Production mode logs:
- Errors only
- No sensitive data

## Testing

### Manual Testing with cURL

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Get Portfolio (with token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing Tools

- **Postman** - API testing GUI
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension

## Performance

### Database Connection Pooling

Prisma handles connection pooling automatically.
Default: 10 connections

To adjust:
```env
DATABASE_URL="postgresql://...?connection_limit=20"
```

### Query Optimization

- Use `select` to fetch only needed fields
- Use `include` carefully to avoid N+1 queries
- Add database indexes for frequently queried fields

### Rate Limiting (TODO)

Consider adding rate limiting for production:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Security Best Practices

1. ✅ Passwords hashed with bcrypt
2. ✅ JWT for authentication
3. ✅ Input validation
4. ✅ SQL injection prevention (Prisma)
5. ⚠️ Add rate limiting (production)
6. ⚠️ Add helmet.js (production)
7. ⚠️ Enable HTTPS (production)
8. ⚠️ Add request logging (production)

### Production Additions

```bash
npm install helmet express-rate-limit morgan
```

```javascript
const helmet = require('helmet');
const morgan = require('morgan');

app.use(helmet());
app.use(morgan('combined'));
```

## Deployment

### Environment Variables (Production)

Set these on your hosting platform:
- `DATABASE_URL` - Production database URL
- `JWT_SECRET` - Strong random secret
- `NODE_ENV=production`
- `FRONTEND_URL` - Production frontend URL

### Database Migrations (Production)

```bash
npx prisma migrate deploy
```

### Hosting Options

- **Heroku** - Easy deployment, free tier available
- **Railway** - Modern platform, good free tier
- **Render** - Free tier, easy PostgreSQL
- **AWS/DigitalOcean** - More control, requires setup

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "message": "WealthWise API is running"
}
```

### Database Status

```bash
# Check Prisma connection
npx prisma db pull
```

### Logs

Development:
```bash
npm run dev
# Logs to console
```

Production:
```bash
# Use process manager
pm2 start server.js --name wealthwise-api
pm2 logs wealthwise-api
```

## Troubleshooting

### Database Connection Failed

1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Test connection: `psql -U username -d database`
4. Check firewall settings

### Port Already in Use

```bash
# Find process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### Prisma Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### CORS Errors

Verify FRONTEND_URL in .env matches your frontend URL exactly.

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Guide](https://jwt.io/introduction)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
