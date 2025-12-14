process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://test:test@cluster.mongodb.net/test';
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with default role "user"', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.role).toBe('user');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should hash password before saving', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.password).not.toBe('password123');
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it('should return 400 if email already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser1',
          email: 'test@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });
  });
});
