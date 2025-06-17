const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/user');
const db = require('../../test/setup/db');
const User = require('../../models/UserModel');
const { validUser } = require('../../test/fixtures/users');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

// Set test secret for JWT
process.env.SECRET = 'test-secret-key';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('User Controller Tests', () => {
  describe('POST /api/user/signup', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send(validUser)
        .expect(200);

      expect(response.body).toHaveProperty('email', validUser.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    it('should return 400 with weak password', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Password is not strong enough');
    });

    it('should return 400 with invalid email', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'invalid-email',
          password: 'Test@123456',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(400);

      expect(response.body.error).toContain('Email is not valid');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        })
        .expect(400);

      expect(response.body.error).toContain('All fields must be filled');
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.signup(
        validUser.email,
        validUser.password,
        validUser.firstName,
        validUser.lastName
      );
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: validUser.email,
          password: validUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('email', validUser.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    it('should return 400 with wrong password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: validUser.email,
          password: 'WrongPassword123!'
        })
        .expect(400);

      expect(response.body.error).toContain('The password you entered is incorrect');
    });

    it('should return 400 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(400);

      expect(response.body.error).toContain('No account found with this email address');
    });
  });

  describe('POST /api/user/logout', () => {
    it('should return logout message', async () => {
      const response = await request(app)
        .post('/api/user/logout')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User logged out');
    });
  });
});
