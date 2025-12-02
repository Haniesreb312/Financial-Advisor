const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const portfolioRoutes = require('../../routes/portfolio');
const { PrismaClient } = require('@prisma/client');
const { mockPortfolio, mockUser } = require('../helpers/mockData');

const prisma = new PrismaClient();

// Create test app
const app = express();
app.use(express.json());
app.use('/api/portfolio', portfolioRoutes);

describe('Portfolio API Integration', () => {
  let authToken;

  beforeEach(() => {
    authToken = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET);
  });

  describe('GET /api/portfolio', () => {
    it('should get portfolio with valid token', async () => {
      prisma.portfolio.findFirst.mockResolvedValue(mockPortfolio);

      const response = await request(app)
        .get('/api/portfolio')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.portfolio).toBeDefined();
      expect(response.body.portfolio.stocks).toBe(28125);
    });

    it('should create default portfolio if none exists', async () => {
      prisma.portfolio.findFirst.mockResolvedValue(null);
      prisma.portfolio.create.mockResolvedValue(mockPortfolio);

      const response = await request(app)
        .get('/api/portfolio')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(prisma.portfolio.create).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/portfolio');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/portfolio', () => {
    it('should update portfolio with valid data', async () => {
      const updatedPortfolio = { ...mockPortfolio, stocks: 30000 };
      prisma.portfolio.upsert.mockResolvedValue(updatedPortfolio);
      prisma.activity.create.mockResolvedValue({});

      const response = await request(app)
        .put('/api/portfolio')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          stocks: 30000,
          bonds: 15000,
          realEstate: 12000,
          cash: 8000,
          totalInvested: 60000,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Portfolio updated successfully');
      expect(response.body.portfolio).toBeDefined();
    });

    it('should handle partial updates', async () => {
      prisma.portfolio.upsert.mockResolvedValue(mockPortfolio);
      prisma.activity.create.mockResolvedValue({});

      const response = await request(app)
        .put('/api/portfolio')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          stocks: 35000,
        });

      expect(response.status).toBe(200);
    });

    it('should reject update without token', async () => {
      const response = await request(app)
        .put('/api/portfolio')
        .send({
          stocks: 30000,
        });

      expect(response.status).toBe(401);
    });
  });
});
