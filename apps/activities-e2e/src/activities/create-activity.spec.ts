import axios from 'axios';

import { createCustomer, getApiToken } from '../support/helpers';
import { to } from '../support/utils';

describe('POST /api/activities', () => {
  let apiToken: string;
  let customer: any;

  beforeAll(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common['api-token'] = apiToken;
  });

  it('should create activity', async () => {
    const data = { action: 'test', username: 'test user', time: '2023-08-08T01:01:00.000Z', value: 1 };
    const [err, res] = await to(axios.post('/api/activities', data));

    expect(err).toBeNull();
    expect(res.status).toEqual(201);
    expect(res.data).toMatchObject(data);
  });

  it('should return 400 if action is missing', async () => {
    const data = { username: 'test user', time: '2023-08-08T01:01:00.000Z', value: 1 };
    const [err] = await to(axios.post('/api/activities', data));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(400);
    expect(err.response.data.message).toEqual(['action should not be empty', 'action must be a string']);
  });

  it('should return 400 if username is missing', async () => {
    const data = { action: 'test', time: '2023-08-08T01:01:00.000Z', value: 1 };
    const [err] = await to(axios.post('/api/activities', data));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(400);
    expect(err.response.data.message).toEqual(['username should not be empty', 'username must be a string']);
  });

  it('should create activity with the necessary minimum data', async () => {
    const data = { action: 'test', username: 'test user' };
    const [err, res] = await to(axios.post('/api/activities', data));

    expect(err).toBeNull();
    expect(res.status).toEqual(201);
    expect(res.data).toMatchObject(data);
  });

  it('should return 401 if api-token is missing', async () => {
    const data = { action: 'test', username: 'test user', time: '2023-08-08T01:01:00.000Z', value: 1 };
    const [err] = await to(axios.post('/api/activities', data, { headers: { 'api-token': '' } }));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(401);
  });
});
