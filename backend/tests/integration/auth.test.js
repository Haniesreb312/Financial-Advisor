const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');
const { PrismaClient } = require('@prisma/client');
const { mockUser, mockUserWithoutPassword } = require('../helpers/mockData');

const prisma = new PrismaClient();

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Integration', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user with valid data', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUserWithoutPassword);
      prisma.activity.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration without required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          // Missing name and password
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.activity.create.mockResolvedValue({});
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.password).toBeUndefined();
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should reject login without password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user data with valid token', async () => {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET);

      prisma.user.findUnique.mockResolvedValue(mockUserWithoutPassword);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(mockUser.id);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No authentication token, access denied');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token is invalid or expired');
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update profile with valid data and token', async () => {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET);

      const updatedUser = { ...mockUserWithoutPassword, name: 'Updated Name' };
      prisma.user.update.mockResolvedValue(updatedUser);
      prisma.activity.create.mockResolvedValue({});

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          phone: '555-9999',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.name).toBe('Updated Name');
    });

    it('should reject profile update without token', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(401);
    });
  });
});
