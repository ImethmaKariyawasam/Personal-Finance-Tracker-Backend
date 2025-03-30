const mongoose = require('mongoose');
const Goal = require('../../models/Goal'); // Adjust the path if necessary
const { startTestDatabase, stopTestDatabase } = require('./setup');

beforeAll(async () => {
    await startTestDatabase();
});

afterAll(async () => {
    await stopTestDatabase();
});

beforeEach(async () => {
    await Goal.deleteMany(); // Clear database before each test
});

describe('Goal Model Test', () => {
    test('should create and save a goal successfully', async () => {
        const goalData = { 
            userId: new mongoose.Types.ObjectId(), 
            title: 'Save for Vacation', 
            description: 'Save $5000 for a vacation', 
            targetDate: new Date('2024-12-31'), 
            completed: false
        };
        const goal = new Goal(goalData);
        const savedGoal = await goal.save();

        expect(savedGoal._id).toBeDefined();
        expect(savedGoal.userId).toEqual(goalData.userId);
        expect(savedGoal.title).toBe(goalData.title);
        expect(savedGoal.description).toBe(goalData.description);
        expect(savedGoal.targetDate.toISOString()).toBe(goalData.targetDate.toISOString());
        expect(savedGoal.completed).toBe(false);
    });

    test('should fail if required fields are missing', async () => {
        const goal = new Goal({ description: 'No title provided' }); // Missing `userId` and `title`

        let error;
        try {
            await goal.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.userId).toBeDefined();
        expect(error.errors.title).toBeDefined();
    });

    test('should retrieve a goal by title', async () => {
        const goalData = { 
            userId: new mongoose.Types.ObjectId(), 
            title: 'Buy a Car', 
            description: 'Save $10000 for a car', 
            targetDate: new Date('2025-12-31')
        };
        await Goal.create(goalData);

        const foundGoal = await Goal.findOne({ title: 'Buy a Car' });

        expect(foundGoal).not.toBeNull();
        expect(foundGoal.description).toBe(goalData.description);
    });

    test('should delete a goal', async () => {
        const goal = await Goal.create({ 
            userId: new mongoose.Types.ObjectId(), 
            title: 'Buy a House', 
            description: 'Save $50000 for a house' 
        });

        await Goal.deleteOne({ _id: goal._id });
        const deletedGoal = await Goal.findById(goal._id);

        expect(deletedGoal).toBeNull();
    });

    test('should update a goal title', async () => {
        const goal = await Goal.create({ 
            userId: new mongoose.Types.ObjectId(), 
            title: 'Old Title', 
            description: 'Some description' 
        });

        goal.title = 'New Title';
        const updatedGoal = await goal.save();

        expect(updatedGoal.title).toBe('New Title');
    });

    test('should mark a goal as completed', async () => {
        const goal = await Goal.create({ 
            userId: new mongoose.Types.ObjectId(), 
            title: 'Read 10 Books', 
            completed: false 
        });

        goal.completed = true;
        const updatedGoal = await goal.save();

        expect(updatedGoal.completed).toBe(true);
    });
});
