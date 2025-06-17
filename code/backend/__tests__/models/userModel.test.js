const User = require('../../models/UserModel');
const db = require('../../test/setup/db');
const { validUser, weakPasswordUser, invalidEmailUser, missingFieldsUser } = require('../../test/fixtures/users');

// Setup connection to the database
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('User Model Tests', () => {
  describe('User.signup', () => {
    it('should create a new user with valid data', async () => {
      const user = await User.signup(
        validUser.email,
        validUser.password,
        validUser.firstName,
        validUser.lastName
      );

      expect(user).toBeDefined();
      expect(user.email).toBe(validUser.email);
      expect(user.firstName).toBe(validUser.firstName);
      expect(user.lastName).toBe(validUser.lastName);
      expect(user.password).not.toBe(validUser.password); // Should be hashed
    });

    it('should throw error with weak password', async () => {
      await expect(
        User.signup(
          weakPasswordUser.email,
          weakPasswordUser.password,
          weakPasswordUser.firstName,
          weakPasswordUser.lastName
        )
      ).rejects.toThrow('Password is not strong enough');
    });

    it('should throw error with invalid email', async () => {
      await expect(
        User.signup(
          invalidEmailUser.email,
          invalidEmailUser.password,
          invalidEmailUser.firstName,
          invalidEmailUser.lastName
        )
      ).rejects.toThrow('Email is not valid');
    });

    it('should throw error with missing fields', async () => {
      await expect(
        User.signup(
          missingFieldsUser.email,
          missingFieldsUser.password,
          undefined,
          undefined
        )
      ).rejects.toThrow('All fields must be filled');
    });

    it('should throw error if email already exists', async () => {
      // Create first user
      await User.signup(
        validUser.email,
        validUser.password,
        validUser.firstName,
        validUser.lastName
      );

      // Try to create another user with same email
      await expect(
        User.signup(
          validUser.email,
          'Different@123',
          'Another',
          'User'
        )
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('User.login', () => {
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
      const user = await User.login(validUser.email, validUser.password);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(validUser.email);
      expect(user.loginAttempts).toBe(0);
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        User.login('nonexistent@example.com', 'Password123!')
      ).rejects.toThrow('No account found with this email address');
    });

    it('should throw error with wrong password', async () => {
      await expect(
        User.login(validUser.email, 'WrongPassword123!')
      ).rejects.toThrow(/The password you entered is incorrect/);
    });

    it('should track failed login attempts', async () => {
      // First failed attempt
      await expect(
        User.login(validUser.email, 'WrongPassword1!')
      ).rejects.toThrow('You have 4 attempts remaining');

      // Second failed attempt
      await expect(
        User.login(validUser.email, 'WrongPassword2!')
      ).rejects.toThrow('You have 3 attempts remaining');
    });

    it('should lock account after 5 failed attempts', async () => {
      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          await User.login(validUser.email, 'WrongPassword!');
        } catch (error) {
          // Expected to fail
        }
      }

      // 6th attempt should show account is locked
      await expect(
        User.login(validUser.email, validUser.password)
      ).rejects.toThrow(/Account is temporarily locked/);
    });
  });
});
