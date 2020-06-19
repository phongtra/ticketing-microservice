import mongoose from 'mongoose';

export const DbConnect = async () => {
  let retries = 5;
  while (retries > 0)
    try {
      await mongoose.connect('mongodb://auth-mongo-srv-cluster:27017/auth', {
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
