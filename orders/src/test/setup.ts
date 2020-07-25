import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;
jest.mock('../NatsWrapper');
beforeAll(async () => {
  process.env.JWT_KEY = 'adhaskdhwuihqewuihweuhwi';
  mongo = new MongoMemoryServer();
  const mongoURL = await mongo.getUri();
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();

  await mongo.stop();
});
