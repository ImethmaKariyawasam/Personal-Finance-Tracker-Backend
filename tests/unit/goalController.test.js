const { createGoal, getGoals, updateGoal, deleteGoal } = require('../../controllers/goalController');
const Goal = require('../../models/Goal');
const { createNotification } = require('../../services/notificationService');

// Mock the Goal model and notificationService
jest.mock('../../models/Goal');
jest.mock('../../services/notificationService');

describe('Goal Controller', () => {
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

  describe('createGoal', () => {
    it('should create a new goal and send a notification', async () => {
      req.body = {
        title: 'Save for Vacation',
        description: 'Save $5000 for a vacation',
        targetDate: '2024-12-31'
      };

      // Mock Goal.save to return the saved goal
      const mockGoal = {
        _id: '65a1b2c3d4e5f6a7b8c9d0e1',
        userId: req.user.userId,
        title: 'Save for Vacation',
        description: 'Save $5000 for a vacation',
        targetDate: '2024-12-31',
        createdAt: '2023-12-15T10:00:00.000Z'
      };
      Goal.prototype.save = jest.fn().mockResolvedValue(mockGoal); // Corrected mock

      // Mock createNotification to return successfully
      createNotification.mockResolvedValue(true);

      await createGoal(req, res);

      // Assertions
      expect(Goal.prototype.save).toHaveBeenCalled();
      expect(createNotification).toHaveBeenCalledWith(
        req.user.userId,
        `You have successfully created a new goal: ${req.body.title}.`,
        'goal'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockGoal);
    });

    it('should handle errors during goal creation', async () => {
      req.body = {
        title: 'Save for Vacation',
        description: 'Save $5000 for a vacation',
        targetDate: '2024-12-31'
      };

      // Mock Goal.save to throw an error
      Goal.prototype.save = jest.fn().mockRejectedValue(new Error('Database error')); // Corrected mock

      await createGoal(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getGoals', () => {
    it('should fetch all goals for the logged-in user', async () => {
      const mockGoals = [
        { userId: req.user.userId, title: 'Save for Vacation', description: 'Save $5000 for a vacation', targetDate: '2024-12-31' },
        { userId: req.user.userId, title: 'Buy a Car', description: 'Save $10000 for a car', targetDate: '2025-12-31' }
      ];

      // Mock Goal.find to return the mock goals
      Goal.find.mockResolvedValue(mockGoals);

      await getGoals(req, res);

      // Assertions
      expect(Goal.find).toHaveBeenCalledWith({ userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith(mockGoals);
    });

    it('should handle errors when fetching goals', async () => {
      // Mock Goal.find to throw an error
      Goal.find.mockRejectedValue(new Error('Database error'));

      await getGoals(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateGoal', () => {
    it('should update a goal', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = { title: 'Save for Car', description: 'Save $10000 for a car', targetDate: '2025-12-31' };

      const mockUpdatedGoal = {
        _id: req.params.id,
        userId: req.user.userId,
        ...req.body
      };

      // Mock Goal.findOneAndUpdate to return the updated goal
      Goal.findOneAndUpdate.mockResolvedValue(mockUpdatedGoal);

      await updateGoal(req, res);

      // Assertions
      expect(Goal.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedGoal);
    });

    it('should handle errors when updating a goal', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = { title: 'Save for Car', description: 'Save $10000 for a car', targetDate: '2025-12-31' };

      // Mock Goal.findOneAndUpdate to throw an error
      Goal.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await updateGoal(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Goal.findOneAndDelete to return successfully
      Goal.findOneAndDelete.mockResolvedValue(true);

      await deleteGoal(req, res);

      // Assertions
      expect(Goal.findOneAndDelete).toHaveBeenCalledWith({ _id: req.params.id, userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith({ message: 'Goal deleted successfully' });
    });

    it('should handle errors when deleting a goal', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Goal.findOneAndDelete to throw an error
      Goal.findOneAndDelete.mockRejectedValue(new Error('Deletion failed'));

      await deleteGoal(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Deletion failed' });
    });
  });
});