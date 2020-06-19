import request from 'supertest';
import { app } from '../../App';

it('clear the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'Godlike123!' })
    .expect(200);
  const res = await request(app).get('/api/users/signout').send({}).expect(200);

  expect(res.get('Set-Cookie')).toEqual([
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  ]);
});
