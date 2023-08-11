import axios from 'axios';
import { faker } from '@faker-js/faker';

import { createCustomer, createActivity, getApiToken } from '../support/helpers';
import { to } from '../support/utils';

describe('GET /api/activities', () => {
  let customer: any;
  let apiToken: string;

  beforeEach(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${customer.accessToken}`;
  });

  it('should return all activities', async () => {
    const activities = await Promise.all([createActivity(apiToken), createActivity(apiToken)]);
    const [err, res] = await to(axios.get('/api/activities'));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data).toHaveLength(activities.length);

    const receivedActivities = res.data.map((activity: any) => ({
      id: activity.id,
      action: activity.action,
      username: activity.username,
      time: activity.time,
      value: activity.value,
    }));

    for (const activity of activities) {
      expect(receivedActivities).toContainEqual(activity);
    }
  });

  it('should return requested activity filtered by action', async () => {
    const [activity1] = await Promise.all([createActivity(apiToken), createActivity(apiToken)]);
    const query = { action: activity1.action };
    const [err, res] = await to(axios.get(`/api/activities?${new URLSearchParams(query)}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data).toHaveLength(1);
    expect(res.data.at(0)).toMatchObject(activity1);
  });

  it('should return requested activity filtered by action (search)', async () => {
    const [activity1] = await Promise.all([createActivity(apiToken), createActivity(apiToken)]);
    const query = { search: activity1.action.substr(0, 4) };
    const [err, res] = await to(axios.get(`/api/activities?${new URLSearchParams(query)}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data).toHaveLength(1);
    expect(res.data.at(0)).toMatchObject(activity1);
  });

  it('should return requested activity filtered by username', async () => {
    const [activity1] = await Promise.all([createActivity(apiToken), createActivity(apiToken)]);
    const query = { username: activity1.username };
    const [err, res] = await to(axios.get(`/api/activities?${new URLSearchParams(query)}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data).toHaveLength(1);
    expect(res.data.at(0)).toMatchObject(activity1);
  });

  it('should return properly ordered activities with order: $asc', async () => {
    const [activity1, activity2] = await Promise.all([
      createActivity(apiToken, { time: faker.date.recent() }),
      createActivity(apiToken, { time: faker.date.past() }),
    ]);
    const [err, res] = await to(axios.get(`/api/activities?${new URLSearchParams({ order: '$asc' })}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data.at(0)).toMatchObject(activity2);
    expect(res.data.at(1)).toMatchObject(activity1);
  });

  it('should return properly ordered activities with order: $desc', async () => {
    const [activity1, activity2] = await Promise.all([
      createActivity(apiToken, { time: faker.date.past() }),
      createActivity(apiToken, { time: faker.date.recent() }),
    ]);
    const [err, res] = await to(axios.get(`/api/activities?${new URLSearchParams({ order: '$desc' })}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);
    expect(res.data.at(0)).toMatchObject(activity2);
    expect(res.data.at(1)).toMatchObject(activity1);
  });

  it('should return 401 if accessToken is missing', async () => {
    const [err] = await to(axios.get('/api/activities', { headers: { Authorization: '' } }));

    expect(err).not.toBeNull();
    expect(err.response.status).toEqual(401);
  });
});
