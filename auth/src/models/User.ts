import mongoose, { Schema, Model, Document } from 'mongoose';

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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
