import axios from 'axios';
import { faker } from '@faker-js/faker';

import { createCustomer, getApiToken, createActivity } from '../support/helpers';
import { to } from '../support/utils';

describe('DELETE /api/activities/:id', () => {
  let apiToken: string;
  let customer: any;

  beforeAll(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common['api-token'] = apiToken;
  });

  it('should remove requested activity', async () => {
    const activity = await createActivity();
    const [deleteErr, deleteRes] = await to(axios.delete(`/api/activities/${activity.id}`));

    expect(deleteErr).toBeNull();
    expect(deleteRes.status).toEqual(200);
    expect(deleteRes.data).toMatchObject({ ok: true });

    const [fetchErr] = await to(axios.delete(`/api/activities/${activity.id}`));
    expect(fetchErr).not.toBeNull();
    expect(fetchErr.response.status).toEqual(404);
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
