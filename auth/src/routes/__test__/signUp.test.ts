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

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: 'Godlike123!'
    })
    .expect(400);
});
it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123'
    })
    .expect(400);
});
it('returns a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});
it('disallow duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(400);
});
it('set a cookie after successful sign up', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);
  expect(res.get('Set-Cookie')).toBeDefined();
});
