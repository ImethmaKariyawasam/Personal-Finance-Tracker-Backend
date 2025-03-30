const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const startTestDatabase = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const stopTestDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

module.exports = { startTestDatabase, stopTestDatabase };
