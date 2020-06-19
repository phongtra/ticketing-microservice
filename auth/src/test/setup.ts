import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../App';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin: () => Promise<string[]>;
    }
  }
}

let mongo: MongoMemoryServer;

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
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'Godlike123!';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
