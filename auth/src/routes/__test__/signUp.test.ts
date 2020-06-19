import request from 'supertest';
import { app } from '../../App';

it('returns a 201 on successful sign up', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
});
