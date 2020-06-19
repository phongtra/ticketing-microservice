import request from 'supertest';
import { app } from '../../App';

it('returns a 200 on successful sign in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'Godlike123!' })
    .expect(200);
  expect(res.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with a non-existing email and password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test1@test.com', password: 'Godlike123assa!' })
    .expect(400);
});
it('fails when incorrect password is provide', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'skadhsakdhak' })
    .expect(400);
});
