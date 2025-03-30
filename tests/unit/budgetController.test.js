const { createBudget, getBudgets, updateBudget, deleteBudget } = require('../../controllers/budgetController');
const Budget = require('../../models/Budget');

// Mock the Budget model
jest.mock('../../models/Budget');

describe('Budget Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: '65a1b2c3d4e5f6a7b8c9d0e2' }, // Mock authenticated user
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBudget', () => {
    it('should create a new budget', async () => {
      req.body = {
        category: 'Food',
        limit: 500
      };

      // Mock Budget.save to return the saved budget
      const mockBudget = {
        _id: '65a1b2c3d4e5f6a7b8c9d0e1',
        userId: req.user.userId,
        category: 'Food',
        limit: 500,
        createdAt: '2025-03-10T22:34:10.110Z'
      };
      Budget.prototype.save = jest.fn().mockResolvedValue(mockBudget); // Corrected mock

      await createBudget(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBudget);
    });

    it('should handle errors during budget creation', async () => {
      req.body = {
        category: 'Food',
        limit: 500
      };

      // Mock Budget.save to throw an error
      Budget.prototype.save = jest.fn().mockRejectedValue(new Error('Database error')); // Corrected mock

      await createBudget(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getBudgets', () => {
    it('should fetch all budgets for the logged-in user', async () => {
      const mockBudgets = [
        { userId: req.user.userId, category: 'Food', limit: 500 },
        { userId: req.user.userId, category: 'Transportation', limit: 300 }
      ];

      // Mock Budget.find to return the mock budgets
      Budget.find.mockResolvedValue(mockBudgets);

      await getBudgets(req, res);

      // Assertions
      expect(Budget.find).toHaveBeenCalledWith({ userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith(mockBudgets);
    });

    it('should handle errors when fetching budgets', async () => {
      // Mock Budget.find to throw an error
      Budget.find.mockRejectedValue(new Error('Database error'));

      await getBudgets(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateBudget', () => {
    it('should update a budget', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = {
        category: 'Food',
        limit: 600
      };

      // Mock Budget.findOneAndUpdate to return the updated budget
      const mockUpdatedBudget = {
        _id: req.params.id,
        userId: req.user.userId,
        category: 'Food',
        limit: 600
      };
      Budget.findOneAndUpdate.mockResolvedValue(mockUpdatedBudget);

      await updateBudget(req, res);

      // Assertions
      expect(Budget.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedBudget);
    });

    it('should handle errors when updating a budget', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = {
        category: 'Food',
        limit: 600
      };

      // Mock Budget.findOneAndUpdate to throw an error
      Budget.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await updateBudget(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  describe('deleteBudget', () => {
    it('should delete a budget', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Budget.findOneAndDelete to return successfully
      Budget.findOneAndDelete.mockResolvedValue(true);

      await deleteBudget(req, res);

      // Assertions
      expect(Budget.findOneAndDelete).toHaveBeenCalledWith({ _id: req.params.id, userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith({ message: 'Budget deleted successfully' });
    });

    it('should handle errors when deleting a budget', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Budget.findOneAndDelete to throw an error
      Budget.findOneAndDelete.mockRejectedValue(new Error('Deletion failed'));

      await deleteBudget(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Deletion failed' });
    });
  });
});