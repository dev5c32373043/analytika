import axios from 'axios';
import { faker } from '@faker-js/faker';

import { createCustomer, getApiToken, createActivity } from '../support/helpers';
import { to } from '../support/utils';

describe('PATCH /api/activities/:id', () => {
  let apiToken: string;
  let customer: any;

  beforeAll(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common['api-token'] = apiToken;
  });

  it('should update activity', async () => {
    const activity = await createActivity();
    const update = { action: `${faker.word.verb()} ${faker.word.noun()}`, username: faker.internet.userName() };
    const [updateErr, updateRes] = await to(axios.patch(`/api/activities/${activity.id}`, update));

    expect(updateErr).toBeNull();
    expect(updateRes.status).toEqual(200);
    expect(updateRes.data).toMatchObject(update);

    const [fetchErr, fetchRes] = await to(axios.get(`/api/activities/${activity.id}`));

    expect(fetchErr).toBeNull();
    expect(fetchRes.data).toMatchObject(update);
  });

  it('should not update forbidden fields', async () => {
    const activity = await createActivity();
    const update = { id: faker.string.uuid(), time: faker.date.recent() };
    const [updateErr, updateRes] = await to(axios.patch(`/api/activities/${activity.id}`, update));

    expect(updateErr).toBeNull();
    expect(updateRes.status).toEqual(200);
    expect(updateRes.data).not.toMatchObject(update);

    const [fetchErr, fetchRes] = await to(axios.get(`/api/activities/${activity.id}`));

    expect(fetchErr).toBeNull();
    expect(fetchRes.data).not.toMatchObject(update);
  });

  it('should return 404 if activity is not exists', async () => {
    await createActivity();
    const [err] = await to(axios.get(`/api/activities/${faker.string.uuid()}`));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(404);
    expect(err.response.data.message).toEqual('Activity not found');
  });

  it('should return 401 if api-token is missing', async () => {
    const activity = await createActivity();
    const [err] = await to(axios.get(`/api/activities/${activity.id}`, { headers: { 'api-token': '' } }));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(401);
  });
});
