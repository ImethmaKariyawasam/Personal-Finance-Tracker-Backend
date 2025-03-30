const mongoose = require('mongoose');
const User = require('../../models/User'); // Adjust the path if necessary
const bcrypt = require('bcryptjs');
const { startTestDatabase, stopTestDatabase } = require('./setup');

beforeAll(async () => {
    await startTestDatabase();
});

afterAll(async () => {
    await stopTestDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear users before each test
});

describe('User Authentication Model Test', () => {
    test('should create and save a user successfully', async () => {
        const userData = {
            username: 'testuser',
            password: 'securepassword',
            role: 'user'
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.role).toBe(userData.role);
        expect(savedUser.isAdmin).toBe(false); // Default value
    });

    test('should enforce unique username constraint', async () => {
        const userData = {
            username: 'uniqueuser',
            password: 'password123'
        };

        await User.create(userData);

        let error;
        try {
            await User.create(userData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(11000); // MongoDB duplicate key error
    });

    test('should hash password before saving', async () => {
        const userData = {
            username: 'hasheduser',
            password: 'plaintextpassword'
        };

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ username: userData.username });
        expect(foundUser).not.toBeNull();
        expect(foundUser.password).not.toBe(userData.password);

        const isMatch = await bcrypt.compare(userData.password, foundUser.password);
        expect(isMatch).toBe(true);
    });

    test('should correctly assign admin role when specified', async () => {
        const userData = {
            username: 'adminuser',
            password: 'adminpass',
            role: 'admin',
            isAdmin: true
        };

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ username: userData.username });

        expect(foundUser).not.toBeNull();
        expect(foundUser.role).toBe('admin');
        expect(foundUser.isAdmin).toBe(true);
    });

    test('should authenticate a user with correct credentials', async () => {
        const userData = {
            username: 'authuser',
            password: 'mypassword'
        };

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ username: userData.username });
        const isMatch = await bcrypt.compare(userData.password, foundUser.password);

        expect(foundUser).not.toBeNull();
        expect(isMatch).toBe(true);
    });

    test('should fail authentication with incorrect password', async () => {
        const userData = {
            username: 'wrongpassuser',
            password: 'correctpassword'
        };

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ username: userData.username });
        const isMatch = await bcrypt.compare('incorrectpassword', foundUser.password);

        expect(foundUser).not.toBeNull();
        expect(isMatch).toBe(false);
    });
});
