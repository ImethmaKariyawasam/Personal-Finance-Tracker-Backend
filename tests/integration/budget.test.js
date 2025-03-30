const mongoose = require('mongoose');
const Budget = require('../../models/Budget');  // Adjust the path if necessary
const { startTestDatabase, stopTestDatabase } = require('./setup'); 

beforeAll(async () => {
    await startTestDatabase();
});

afterAll(async () => {
    await stopTestDatabase();
});

beforeEach(async () => {
    await Budget.deleteMany(); // Clear database before each test
});

describe('Budget Model Test', () => {
    test('should create and save a budget item successfully', async () => {
        const budgetData = { 
            userId: new mongoose.Types.ObjectId(), 
            category: 'Food', 
            limit: 500 
        };
        const budget = new Budget(budgetData);
        const savedBudget = await budget.save();

        expect(savedBudget._id).toBeDefined();
        expect(savedBudget.userId).toEqual(budgetData.userId);
        expect(savedBudget.category).toBe(budgetData.category);
        expect(savedBudget.limit).toBe(budgetData.limit);
    });

    test('should fail if required fields are missing', async () => {
        const budget = new Budget({ category: 'Entertainment' }); // Missing `userId` and `limit`

        let error;
        try {
            await budget.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.userId).toBeDefined();
        expect(error.errors.limit).toBeDefined();
    });

    test('should retrieve a budget item by category', async () => {
        const budgetData = { 
            userId: new mongoose.Types.ObjectId(), 
            category: 'Rent', 
            limit: 1500 
        };
        await Budget.create(budgetData);

        const foundBudget = await Budget.findOne({ category: 'Rent' });

        expect(foundBudget).not.toBeNull();
        expect(foundBudget.limit).toBe(1500);
    });

    test('should delete a budget item', async () => {
        const budget = await Budget.create({ 
            userId: new mongoose.Types.ObjectId(), 
            category: 'Utilities', 
            limit: 300 
        });

        await Budget.deleteOne({ _id: budget._id });
        const deletedBudget = await Budget.findById(budget._id);

        expect(deletedBudget).toBeNull();
    });

    test('should update a budget limit', async () => {
        const budget = await Budget.create({ 
            userId: new mongoose.Types.ObjectId(), 
            category: 'Entertainment', 
            limit: 100 
        });

        budget.limit = 200;
        const updatedBudget = await budget.save();

        expect(updatedBudget.limit).toBe(200);
    });
});
