import request from 'supertest';
import { app } from '../../App';

it('session management should work across requests', async () => {
  const agent = request.agent(app);

  await agent
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Godlike123!'
    })
    .expect(201);

  let response = await agent.get('/api/users/currentuser').send().expect(200);
  expect(response.body.currentUser?.userEmail).toEqual('test@test.com');

  await agent.get('/api/users/signout').send({}).expect(200);

  response = await agent.get('/api/users/currentuser').send().expect(200);
  expect(response.body.currentUser).toBeNull();
});

it('responds with null if not authenticated', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(res.body.currentUser).toBeNull();
});
