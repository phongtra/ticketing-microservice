//ONLY AVAILABLE FOR TESTING PURPOSES
//DO NOT USE ANYWHERE ELSE IN THE PROJECT

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signIn = () => {
  const id = mongoose.Types.ObjectId().toHexString();
  //Build a JWT payload
  const payload = {
    id,
    email: 'test@test.com'
  };
  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session Object
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //Takse JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //Return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
