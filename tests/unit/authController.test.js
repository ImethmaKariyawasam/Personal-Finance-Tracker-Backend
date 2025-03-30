const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register, login } = require('../../controllers/authController');
const User = require('../../models/User');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        username: 'john',
        password: 'password123',
        role: 'user',
        isAdmin: false,
      };

      // Mock User.save() to return a resolved value
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: '65a1b2c3d4e5f6a7b8c9d0e1',
        username: req.body.username,
        role: req.body.role,
        isAdmin: req.body.isAdmin,
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return an error if registration fails', async () => {
      req.body = {
        username: 'john',
        password: 'password123',
        role: 'user',
        isAdmin: false,
      };

      // Mock User.save() to throw an error
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('login', () => {
    it('should log in a user and return a JWT token', async () => {
      req.body = {
        username: 'john',
        password: 'password123',
      };

      const mockUser = {
        _id: '65a1b2c3d4e5f6a7b8c9d0e1',
        username: 'john',
        password: 'hashed_password',
        role: 'user',
        isAdmin: false,
      };

      // Mock User.findOne() to return a user
      User.findOne.mockResolvedValue(mockUser);

      // Mock bcrypt.compare() to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign() to return a token
      jwt.sign.mockReturnValue('mocked_token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'mocked_token' });
    });

    it('should return 401 if credentials are invalid', async () => {
      req.body = {
        username: 'john',
        password: 'wrongpassword',
      };

      // Mock User.findOne() to return a user
      User.findOne.mockResolvedValue({
        username: 'john',
        password: 'hashed_password',
      });

      // Mock bcrypt.compare() to return false
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return an error if login fails', async () => {
      req.body = {
        username: 'john',
        password: 'password123',
      };

      // Mock User.findOne() to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
