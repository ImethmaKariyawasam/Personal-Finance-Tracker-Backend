const mongoose = require('mongoose');
const Transaction = require('../../models/Transaction'); // Adjust the path if necessary
const { startTestDatabase, stopTestDatabase } = require('./setup');

beforeAll(async () => {
    await startTestDatabase();
});

afterAll(async () => {
    await stopTestDatabase();
});

beforeEach(async () => {
    await Transaction.deleteMany(); // Clear database before each test
});

describe('Transaction Model Test', () => {
    test('should create and save a transaction successfully', async () => {
        const transactionData = { 
            userId: new mongoose.Types.ObjectId(),
            type: 'expense',
            amount: 100,
            currency: 'USD',
            category: 'Food',
            tags: ['groceries'],
            isRecurring: false
        };

        const transaction = new Transaction(transactionData);
        const savedTransaction = await transaction.save();

        expect(savedTransaction._id).toBeDefined();
        expect(savedTransaction.userId).toEqual(transactionData.userId);
        expect(savedTransaction.type).toBe(transactionData.type);
        expect(savedTransaction.amount).toBe(transactionData.amount);
        expect(savedTransaction.currency).toBe(transactionData.currency);
        expect(savedTransaction.category).toBe(transactionData.category);
        expect(savedTransaction.tags).toEqual(transactionData.tags);
        expect(savedTransaction.isRecurring).toBe(transactionData.isRecurring);
    });

    test('should fail if required fields are missing', async () => {
        const transaction = new Transaction({ amount: 100 }); // Missing `userId`, `type`, `category`

        let error;
        try {
            await transaction.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.userId).toBeDefined();
        expect(error.errors.type).toBeDefined();
        expect(error.errors.category).toBeDefined();
    });

    test('should retrieve transactions by userId', async () => {
        const userId = new mongoose.Types.ObjectId();
        const transactionData = { 
            userId, 
            type: 'income', 
            amount: 500, 
            currency: 'USD', 
            category: 'Salary', 
            tags: ['monthly']
        };

        await Transaction.create(transactionData);

        const foundTransactions = await Transaction.find({ userId });

        expect(foundTransactions.length).toBe(1);
        expect(foundTransactions[0].category).toBe('Salary');
        expect(foundTransactions[0].amount).toBe(500);
    });

    test('should delete a transaction', async () => {
        const transaction = await Transaction.create({ 
            userId: new mongoose.Types.ObjectId(),
            type: 'expense',
            amount: 250,
            currency: 'USD',
            category: 'Shopping'
        });

        await Transaction.deleteOne({ _id: transaction._id });
        const deletedTransaction = await Transaction.findById(transaction._id);

        expect(deletedTransaction).toBeNull();
    });

    test('should update a transaction amount', async () => {
        const transaction = await Transaction.create({ 
            userId: new mongoose.Types.ObjectId(),
            type: 'expense',
            amount: 300,
            currency: 'USD',
            category: 'Rent'
        });

        transaction.amount = 400;
        const updatedTransaction = await transaction.save();

        expect(updatedTransaction.amount).toBe(400);
    });
});
