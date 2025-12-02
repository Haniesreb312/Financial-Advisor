// Mock data for testing

const mockUser = {
  id: 'user-123-test-id',
  name: 'Test User',
  email: 'test@example.com',
  password: '$2a$10$X4FZXNvPYqQk1wW.Nc.J8OqYF4ZXH9RVjJH7xKZQjGgZJzLk5vZ2u', // 'password123'
  phone: '555-0100',
  address: '123 Test St',
  dateOfBirth: new Date('1990-01-01'),
  occupation: 'Software Engineer',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockUserWithoutPassword = {
  id: mockUser.id,
  name: mockUser.name,
  email: mockUser.email,
  phone: mockUser.phone,
  address: mockUser.address,
  dateOfBirth: mockUser.dateOfBirth,
  occupation: mockUser.occupation,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
};

const mockPortfolio = {
  id: 'portfolio-123',
  userId: mockUser.id,
  stocks: 28125,
  bonds: 15625,
  realEstate: 12500,
  cash: 6250,
  totalInvested: 55000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockBudget = {
  id: 'budget-123',
  userId: mockUser.id,
  monthlyIncome: 5000,
  housing: 1500,
  utilities: 200,
  food: 400,
  transportation: 300,
  insurance: 200,
  entertainment: 150,
  other: 250,
  month: 11,
  year: 2024,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockRetirementPlan = {
  id: 'retirement-123',
  userId: mockUser.id,
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 50000,
  monthlyContribution: 500,
  expectedReturn: 7,
  retirementGoal: 1000000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockActivity = {
  id: 'activity-123',
  userId: mockUser.id,
  type: 'account',
  description: 'Account created',
  timestamp: new Date('2024-01-01'),
};

module.exports = {
  mockUser,
  mockUserWithoutPassword,
  mockPortfolio,
  mockBudget,
  mockRetirementPlan,
  mockActivity,
};
