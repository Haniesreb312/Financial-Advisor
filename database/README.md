# Database Layer Documentation

## Overview

This directory contains the database schema and configuration for the WealthWise Advisors platform.

## Database Choice: PostgreSQL

### Why PostgreSQL?

1. **ACID Compliance** - Critical for financial data integrity
2. **Data Types** - Native support for NUMERIC for precise financial calculations
3. **Transactions** - Reliable transaction support for financial operations
4. **Scalability** - Excellent performance for complex queries
5. **Security** - Row-level security and robust authentication

### Alternative Databases

#### MongoDB
**Pros:**
- Flexible schema
- Easy to get started
- Good for rapid prototyping

**Cons:**
- Less suitable for financial transactions
- No ACID guarantees across documents
- Requires more application-level validation

**When to use:** If you need extreme flexibility or are building an MVP

#### MySQL
**Pros:**
- Widely supported
- Good performance
- Large community

**Cons:**
- Less advanced features than PostgreSQL
- Historically less reliable for complex transactions

**When to use:** If you're already familiar with MySQL or have existing infrastructure

#### SQLite
**Pros:**
- Zero configuration
- Perfect for development
- Single file database

**Cons:**
- Not suitable for production with multiple users
- Limited concurrency

**When to use:** Development and testing only

## Schema Design

### Entity Relationship Diagram

```
User (1) ──→ (1) Portfolio
  │
  ├──→ (*) Budget
  ├──→ (*) RetirementPlan
  ├──→ (*) Investment
  ├──→ (*) SavingsGoal
  └──→ (*) Activity
```

### Tables

#### users
Core user authentication and profile
- `id`: UUID primary key
- `email`: Unique email for login
- `password`: Bcrypt hashed password
- `name`, `phone`, `address`: Profile data
- `dateOfBirth`, `occupation`: Additional info

#### portfolios
Asset allocation tracking
- One portfolio per user
- Tracks stocks, bonds, real estate, cash
- `totalInvested`: Base investment amount

#### budgets
Monthly budget tracking
- Multiple budgets per user (one per month)
- Unique constraint on (userId, month, year)
- Categorized expenses

#### retirement_plans
Retirement planning scenarios
- Multiple plans per user for different scenarios
- Stores all calculation inputs

#### investments
Individual investment tracking
- Track multiple investments
- Category classification
- Performance tracking data

#### savings_goals
Goal-based savings
- Named savings goals
- Progress tracking
- Interest calculations

#### activities
Audit log
- All user actions
- Timestamp tracking
- Type categorization

## Data Types

### Financial Numbers
**Always use NUMERIC or DECIMAL for money**

```prisma
amount Float  // Good for calculations
```

In production PostgreSQL, map Float to NUMERIC:
```sql
CREATE TABLE example (
  amount NUMERIC(12, 2)  -- 12 digits total, 2 decimal places
);
```

### Dates
```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

### IDs
```prisma
id String @id @default(uuid())
```

UUIDs provide:
- Global uniqueness
- Security (non-sequential)
- Distributed generation

## Indexes

### Automatic Indexes
- Primary keys (id)
- Unique constraints (email)
- Foreign keys

### Custom Indexes (Add if needed)
```prisma
@@index([userId, createdAt])  // For sorting user data by date
@@index([email])               // For login lookups
```

## Migrations

### Creating Migrations
```bash
npx prisma migrate dev --name description
```

### Migration Files
Located in `migrations/` folder (auto-generated)

### Best Practices
1. Always review migrations before applying
2. Never modify existing migrations
3. Use descriptive names
4. Test migrations on development data first

## Security

### Password Storage
- Hashed with bcrypt (cost factor: 10)
- Never store plain text
- Salt automatically included

### Data Access
- All queries through Prisma (prevents SQL injection)
- Row-level security via userId checks
- JWT authentication for API access

### Sensitive Data
Consider encryption for:
- Social Security Numbers (if added)
- Bank account numbers (if added)
- Tax information (if added)

## Performance Optimization

### Query Optimization
```typescript
// Good - Select only needed fields
await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true }
});

// Avoid - Fetches all fields
await prisma.user.findUnique({
  where: { id }
});
```

### Batch Operations
```typescript
// Good - Single query
await prisma.budget.createMany({
  data: budgets
});

// Avoid - Multiple queries
for (const budget of budgets) {
  await prisma.budget.create({ data: budget });
}
```

### Connection Pooling
Prisma handles this automatically. Default pool size: 10

Adjust if needed:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=20"
```

## Backup Strategy

### Development
```bash
pg_dump wealthwise_db > backup.sql
```

### Production
1. **Automated daily backups** (hosting provider)
2. **Point-in-time recovery** enabled
3. **Backup retention**: 30 days minimum
4. **Test restore procedure** monthly

### Restore
```bash
psql wealthwise_db < backup.sql
```

## Monitoring

### Prisma Studio
```bash
npx prisma studio
```
Visual database browser at localhost:5555

### Query Logging
Enable in development:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### Metrics to Monitor
- Query execution time
- Connection pool usage
- Failed queries
- Database size
- Index usage

## Data Privacy (GDPR)

### User Data Deletion
Cascade deletes configured:
```prisma
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

When user deleted, all related data automatically deleted.

### Data Export
Implement endpoint to export all user data:
```typescript
await prisma.user.findUnique({
  where: { id },
  include: {
    portfolios: true,
    budgets: true,
    retirementPlans: true,
    // ... all relations
  }
});
```

## Seeding (Optional)

Create `prisma/seed.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create test users
  await prisma.user.create({
    data: {
      email: 'demo@wealthwise.com',
      password: '...hashed...',
      name: 'Demo User',
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `npx prisma db seed`

## Common Queries

### Get User with Portfolio
```typescript
await prisma.user.findUnique({
  where: { id },
  include: { portfolios: true }
});
```

### Get Budgets for Year
```typescript
await prisma.budget.findMany({
  where: {
    userId,
    year: 2024
  },
  orderBy: { month: 'asc' }
});
```

### Calculate Total Investments
```typescript
const result = await prisma.investment.aggregate({
  where: { userId },
  _sum: { initialInvestment: true }
});
```

## Troubleshooting

### Migration Failed
```bash
npx prisma migrate resolve --rolled-back "migration_name"
```

### Schema Out of Sync
```bash
npx prisma db push  # Force sync (use carefully)
```

### Connection Issues
1. Check PostgreSQL is running
2. Verify DATABASE_URL
3. Check firewall/network
4. Verify credentials

### Prisma Client Issues
```bash
rm -rf node_modules/.prisma
npx prisma generate
```
