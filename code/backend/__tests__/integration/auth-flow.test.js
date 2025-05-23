const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/user');
const db = require('../../test/setup/db');
const { validUser } = require('../../test/fixtures/users');

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

process.env.SECRET = 'test-secret-key';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Authentication Flow Integration Tests', () => {
  it('should complete full authentication flow', async () => {
    // 1. Register a new user
    const signupResponse = await request(app)
      .post('/api/user/signup')
      .send(validUser)
      .expect(200);

    expect(signupResponse.body).toHaveProperty('token');
    const { token } = signupResponse.body;

    // 2. Logout
    await request(app)
      .post('/api/user/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // 3. Login again
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send({
        email: validUser.email,
        password: validUser.password
      })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body.email).toBe(validUser.email);
  });

  it('should handle account lockout flow', async () => {
    // Register user
    await request(app)
      .post('/api/user/signup')
      .send(validUser)
      .expect(200);

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/user/login')
        .send({
          email: validUser.email,
          password: 'WrongPassword!'
        })
        .expect(400);
    }

    // 6th attempt with correct password should still be locked
    const lockedResponse = await request(app)
      .post('/api/user/login')
      .send({
        email: validUser.email,
        password: validUser.password
      })
      .expect(400);

    expect(lockedResponse.body.error).toContain('Account is temporarily locked');
  });
});

// __tests__/utils/jwt.test.js
const jwt = require('jsonwebtoken');
const { loginUser } = require('../../controllers/userController');

describe('JWT Token Tests', () => {
  const testSecret = 'test-secret';
  const userId = '123456789';

  beforeAll(() => {
    process.env.SECRET = testSecret;
  });

  it('should create valid JWT token', () => {
    const token = jwt.sign({ _id: userId }, testSecret, { expiresIn: '3d' });
    
    const decoded = jwt.verify(token, testSecret);
    expect(decoded._id).toBe(userId);
    expect(decoded.exp).toBeDefined();
  });

  it('should expire after 3 days', () => {
    const token = jwt.sign({ _id: userId }, testSecret, { expiresIn: '3d' });
    const decoded = jwt.verify(token, testSecret);
    
    const expirationTime = decoded.exp - decoded.iat;
    expect(expirationTime).toBe(3 * 24 * 60 * 60); // 3 days in seconds
  });
});
