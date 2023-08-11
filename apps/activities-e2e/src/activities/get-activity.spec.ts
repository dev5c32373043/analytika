import axios from 'axios';
import { faker } from '@faker-js/faker';

import { createCustomer, getApiToken, createActivity } from '../support/helpers';
import { to } from '../support/utils';

describe('GET /api/activities/:id', () => {
  let apiToken: string;
  let customer: any;

  beforeAll(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common['api-token'] = apiToken;
  });

  it('should return requested activity', async () => {
    const activity = await createActivity();
    const [err, res] = await to(axios.get(`/api/activities/${activity.id}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data).toMatchObject(activity);
  });

  it('should not return activity with defferent tenantId', async () => {
    const secondCustomer = await createCustomer();
    const apiToken2 = await getApiToken(secondCustomer.accessToken);
    const activity = await createActivity({}, apiToken2);

    const [err] = await to(axios.get(`/api/activities/${activity.id}`));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(404);
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
