import mongoose from 'mongoose';

export const DbConnect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  let retries = 5;
  while (retries > 0)
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      console.log('Connecting to mongodb');
      break;
    } catch (e) {
      retries--;
      console.error('Failed to connect, retries time is: ', retries);
    }
};
