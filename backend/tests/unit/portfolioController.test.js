const { PrismaClient } = require('@prisma/client');
const portfolioController = require('../../controllers/portfolioController');
const { mockRequest, mockResponse, getResponseData } = require('../helpers/testUtils');
const { mockPortfolio, mockUser } = require('../helpers/mockData');

const prisma = new PrismaClient();

describe('Portfolio Controller', () => {
  describe('getPortfolio', () => {
    it('should return existing portfolio', async () => {
      const req = mockRequest({
        userId: mockUser.id,
      });
      const res = mockResponse();

      prisma.portfolio.findFirst.mockResolvedValue(mockPortfolio);

      await portfolioController.getPortfolio(req, res);

      expect(res.json).toHaveBeenCalled();
      const data = getResponseData(res);
      expect(data.portfolio).toBeDefined();
      expect(data.portfolio.id).toBe(mockPortfolio.id);
      expect(data.portfolio.stocks).toBe(28125);
    });

    it('should create default portfolio if none exists', async () => {
      const req = mockRequest({
        userId: mockUser.id,
      });
      const res = mockResponse();

      prisma.portfolio.findFirst.mockResolvedValue(null);
      prisma.portfolio.create.mockResolvedValue(mockPortfolio);

      await portfolioController.getPortfolio(req, res);

      expect(prisma.portfolio.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const data = getResponseData(res);
      expect(data.portfolio).toBeDefined();
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio successfully', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: {
          stocks: 30000,
          bonds: 15000,
          realEstate: 12000,
          cash: 8000,
          totalInvested: 60000,
        },
      });
      const res = mockResponse();

      const updatedPortfolio = { ...mockPortfolio, stocks: 30000, totalInvested: 60000 };
      prisma.portfolio.upsert.mockResolvedValue(updatedPortfolio);
      prisma.activity.create.mockResolvedValue({});

      await portfolioController.updatePortfolio(req, res);

      expect(res.json).toHaveBeenCalled();
      const data = getResponseData(res);
      expect(data.message).toBe('Portfolio updated successfully');
      expect(data.portfolio.stocks).toBe(30000);
    });

    it('should handle numeric values correctly', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: {
          stocks: '25000',
          bonds: '15000',
          realEstate: '10000',
          cash: '5000',
          totalInvested: '55000',
        },
      });
      const res = mockResponse();

      prisma.portfolio.upsert.mockResolvedValue(mockPortfolio);
      prisma.activity.create.mockResolvedValue({});

      await portfolioController.updatePortfolio(req, res);

      expect(prisma.portfolio.upsert).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        update: expect.objectContaining({
          stocks: 25000,
          bonds: 15000,
          realEstate: 10000,
          cash: 5000,
          totalInvested: 55000,
        }),
        create: expect.any(Object),
      });
    });

    it('should create activity log on portfolio update', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: { stocks: 30000, bonds: 15000, realEstate: 12000, cash: 8000, totalInvested: 60000 },
      });
      const res = mockResponse();

      prisma.portfolio.upsert.mockResolvedValue(mockPortfolio);
      prisma.activity.create.mockResolvedValue({});

      await portfolioController.updatePortfolio(req, res);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          type: 'portfolio',
          description: 'Portfolio updated',
        },
      });
    });

    it('should handle missing values with defaults', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: {
          stocks: 30000,
          // Missing bonds, realEstate, cash, totalInvested
        },
      });
      const res = mockResponse();

      prisma.portfolio.upsert.mockResolvedValue(mockPortfolio);
      prisma.activity.create.mockResolvedValue({});

      await portfolioController.updatePortfolio(req, res);

      expect(prisma.portfolio.upsert).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        update: expect.objectContaining({
          stocks: 30000,
          bonds: 0,
          realEstate: 0,
          cash: 0,
          totalInvested: 0,
        }),
        create: expect.any(Object),
      });
    });
  });
});
