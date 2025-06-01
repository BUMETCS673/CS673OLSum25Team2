const validUser = {
  email: 'test@example.com',
  password: 'Test@123456',
  firstName: 'Zack',
  lastName: 'z'
};

const weakPasswordUser = {
  email: 'weak@example.com',
  password: 'weak123',
  firstName: 'Zack',
  lastName: 'Z'
};

const invalidEmailUser = {
  email: 'notanemail',
  password: 'Test@123456',
  firstName: 'Invalid',
  lastName: 'Email'
};

const missingFieldsUser = {
  email: 'missing@example.com',
  password: 'Test@123456'
  // Missing firstName and lastName
};

module.exports = {
  validUser,
  weakPasswordUser,
  invalidEmailUser,
  missingFieldsUser
};