process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

describe('Sweets API', () => {
  let userToken;
  let adminToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://test:test@cluster.mongodb.net/test';
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create regular user
    regularUser = await User.create({
      username: 'regularuser',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    // Create admin user
    adminUser = await User.create({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Get tokens
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.token;
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.category).toBe('Chocolate');
      expect(response.body.price).toBe(2.50);
      expect(response.body.quantity).toBe(100);
    });

    it('should return 403 if regular user tries to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(403);
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummies', price: 1.50, quantity: 200 }
      ]);
    });

    it('should get all sweets for authenticated user', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.00, quantity: 50 },
        { name: 'Gummy Bears', category: 'Gummies', price: 1.50, quantity: 200 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toContain('Chocolate');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every(s => s.category === 'Chocolate')).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2.0&maxPrice=2.75')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Chocolate Bar');
    });
  });

  describe('PUT /api/sweets/:id (Admin only)', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Chocolate Bar',
          price: 3.00
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Chocolate Bar');
      expect(response.body.price).toBe(3.00);
    });

    it('should return 403 if regular user tries to update', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Chocolate Bar'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/sweets/:id (Admin only)', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const deleted = await Sweet.findById(sweetId);
      expect(deleted).toBeNull();
    });

    it('should return 403 if regular user tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should decrease quantity when purchasing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(9);

      const updated = await Sweet.findById(sweetId);
      expect(updated.quantity).toBe(9);
    });

    it('should block purchase when stock is zero', async () => {
      // Set quantity to 0
      await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('out of stock');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock (Admin only)', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should increase quantity when restocking as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(60);

      const updated = await Sweet.findById(sweetId);
      expect(updated.quantity).toBe(60);
    });

    it('should return 403 if regular user tries to restock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(403);
    });
  });
});
