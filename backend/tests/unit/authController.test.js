const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authController = require('../../controllers/authController');
const { mockRequest, mockResponse, getResponseData, getErrorMessage } = require('../helpers/testUtils');
const { mockUser, mockUserWithoutPassword } = require('../helpers/mockData');

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = mockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      // Mock database responses
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUserWithoutPassword);
      prisma.activity.create.mockResolvedValue({});

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const data = getResponseData(res);
      expect(data.message).toBe('User registered successfully');
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.token).toBeDefined();
    });

    it('should reject registration with existing email', async () => {
      const req = mockRequest({
        body: {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const error = getErrorMessage(res);
      expect(error).toBe('User already exists with this email');
    });

    it('should hash password before storing', async () => {
      const req = mockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUserWithoutPassword);
      prisma.activity.create.mockResolvedValue({});

      const hashSpy = jest.spyOn(bcrypt, 'hash');

      await authController.register(req, res);

      expect(hashSpy).toHaveBeenCalledWith('password123', 10);
      hashSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.activity.create.mockResolvedValue({});
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await authController.login(req, res);

      expect(res.status).not.toHaveBeenCalledWith(401);
      const data = getResponseData(res);
      expect(data.message).toBe('Login successful');
      expect(data.token).toBeDefined();
      expect(data.user.password).toBeUndefined();
    });

    it('should reject login with invalid email', async () => {
      const req = mockRequest({
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      const error = getErrorMessage(res);
      expect(error).toBe('Invalid email or password');
    });

    it('should reject login with invalid password', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      const error = getErrorMessage(res);
      expect(error).toBe('Invalid email or password');
    });

    it('should create activity log on successful login', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.activity.create.mockResolvedValue({});
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await authController.login(req, res);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          type: 'login',
          description: 'User logged in',
        },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      const req = mockRequest({
        userId: mockUser.id,
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(mockUserWithoutPassword);

      await authController.getCurrentUser(req, res);

      expect(res.json).toHaveBeenCalled();
      const data = getResponseData(res);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(mockUser.id);
      expect(data.user.password).toBeUndefined();
    });

    it('should return 404 if user not found', async () => {
      const req = mockRequest({
        userId: 'non-existent-id',
      });
      const res = mockResponse();

      prisma.user.findUnique.mockResolvedValue(null);

      await authController.getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      const error = getErrorMessage(res);
      expect(error).toBe('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: {
          name: 'Updated Name',
          phone: '555-9999',
          address: '456 New St',
          occupation: 'Manager',
        },
      });
      const res = mockResponse();

      const updatedUser = { ...mockUserWithoutPassword, name: 'Updated Name' };
      prisma.user.update.mockResolvedValue(updatedUser);
      prisma.activity.create.mockResolvedValue({});

      await authController.updateProfile(req, res);

      expect(res.json).toHaveBeenCalled();
      const data = getResponseData(res);
      expect(data.message).toBe('Profile updated successfully');
      expect(data.user.name).toBe('Updated Name');
    });

    it('should create activity log on profile update', async () => {
      const req = mockRequest({
        userId: mockUser.id,
        body: { name: 'Updated Name' },
      });
      const res = mockResponse();

      prisma.user.update.mockResolvedValue(mockUserWithoutPassword);
      prisma.activity.create.mockResolvedValue({});

      await authController.updateProfile(req, res);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          type: 'profile',
          description: 'Profile updated',
        },
      });
    });
  });
});
