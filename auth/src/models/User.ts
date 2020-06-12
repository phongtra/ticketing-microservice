import mongoose, { Schema, Model, Document } from 'mongoose';
import { Password } from '../services/passwordHashingService';

//interface that describe the properties that are required to create
//a new user

interface UserAttrs {
  email: string;
  password: string;
}

//an interface that describe the properties that user model has

interface UserModel extends Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

//an interface that describes that the properties that a user document has

interface UserDoc extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.password;
  }
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
