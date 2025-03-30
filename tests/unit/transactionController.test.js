const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../../controllers/transactionController');
const Transaction = require('../../models/Transaction');
const { convertCurrency } = require('../../services/currencyService');

// Mock the Transaction model and currencyService
jest.mock('../../models/Transaction');
jest.mock('../../services/currencyService');

describe('Transaction Controller', () => {
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

  // Test for createTransaction
  describe('createTransaction', () => {
    it('should create a new transaction and convert currency to USD', async () => {
      req.body = {
        type: 'expense',
        amount: 100,
        currency: 'EUR',
        category: 'Food',
        tags: ['groceries'],
        isRecurring: false
      };

      // Mock convertCurrency to return a converted amount
      convertCurrency.mockResolvedValue(120); // 100 EUR = 120 USD

      // Mock Transaction.save to return the saved transaction
      const mockTransaction = {
        ...req.body,
        userId: req.user.userId,
        amount: 120, // Converted amount
        currency: 'USD' // Converted currency
      };
      Transaction.prototype.save.mockResolvedValue(mockTransaction);

      await createTransaction(req, res);

      // Assertions
      expect(convertCurrency).toHaveBeenCalledWith(100, 'EUR', 'USD');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTransaction);
    });

    it('should handle errors during transaction creation', async () => {
      req.body = {
        type: 'expense',
        amount: 100,
        currency: 'EUR',
        category: 'Food',
        tags: ['groceries'],
        isRecurring: false
      };

      // Mock convertCurrency to throw an error
      convertCurrency.mockRejectedValue(new Error('Currency conversion failed'));

      await createTransaction(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Currency conversion failed' });
    });
  });

  // Test for getTransactions
  describe('getTransactions', () => {
    it('should fetch all transactions for the logged-in user', async () => {
      const mockTransactions = [
        { userId: req.user.userId, type: 'expense', amount: 120, currency: 'USD', category: 'Food' },
        { userId: req.user.userId, type: 'income', amount: 200, currency: 'USD', category: 'Salary' }
      ];

      // Mock Transaction.find to return the mock transactions
      Transaction.find.mockResolvedValue(mockTransactions);

      await getTransactions(req, res);

      // Assertions
      expect(Transaction.find).toHaveBeenCalledWith({ userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should handle errors when fetching transactions', async () => {
      // Mock Transaction.find to throw an error
      Transaction.find.mockRejectedValue(new Error('Database error'));

      await getTransactions(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  // Test for updateTransaction
  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = { category: 'Transportation' };

      const mockUpdatedTransaction = {
        _id: req.params.id,
        userId: req.user.userId,
        type: 'expense',
        amount: 120,
        currency: 'USD',
        category: 'Transportation'
      };

      // Mock Transaction.findOneAndUpdate to return the updated transaction
      Transaction.findOneAndUpdate.mockResolvedValue(mockUpdatedTransaction);

      await updateTransaction(req, res);

      // Assertions
      expect(Transaction.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTransaction);
    });

    it('should handle errors when updating a transaction', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';
      req.body = { category: 'Transportation' };

      // Mock Transaction.findOneAndUpdate to throw an error
      Transaction.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await updateTransaction(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  // Test for deleteTransaction
  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Transaction.findOneAndDelete to return successfully
      Transaction.findOneAndDelete.mockResolvedValue(true);

      await deleteTransaction(req, res);

      // Assertions
      expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({ _id: req.params.id, userId: req.user.userId });
      expect(res.json).toHaveBeenCalledWith({ message: 'Transaction deleted successfully' });
    });

    it('should handle errors when deleting a transaction', async () => {
      req.params.id = '65a1b2c3d4e5f6a7b8c9d0e1';

      // Mock Transaction.findOneAndDelete to throw an error
      Transaction.findOneAndDelete.mockRejectedValue(new Error('Deletion failed'));

      await deleteTransaction(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Deletion failed' });
    });
  });
});