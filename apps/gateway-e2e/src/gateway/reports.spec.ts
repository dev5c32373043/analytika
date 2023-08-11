import axios from 'axios';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

import { createCustomer, createActivity, getApiToken } from '../support/helpers';
import { wait, to } from '../support/utils';

describe('GET /api/reports/activity/timeline', () => {
  let customer: any;
  let apiToken: string;

  beforeEach(async () => {
    customer = await createCustomer();
    apiToken = await getApiToken(customer.accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${customer.accessToken}`;
  });

  it('should return activity timeline report', async () => {
    const activities = await Promise.all([
      createActivity(apiToken, { time: faker.date.recent({ days: 90 }) }),
      createActivity(apiToken, { time: faker.date.recent({ days: 90 }) }),
      createActivity(apiToken, { time: faker.date.recent({ days: 90 }) }),
    ]);

    await wait(3000);

    const [err, res] = await to(axios.get('/api/reports/activity/timeline'));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);

    const activityByMonth = activities.reduce((acc, activity) => {
      const month = dayjs(activity.time).format('MMM');
      acc[month] ||= 0;
      acc[month] += 1;
      return acc;
    }, {});

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedKeys = Object.keys(activityByMonth).sort((k1, k2) => months.indexOf(k1) - months.indexOf(k2));
    const sortedValues = sortedKeys.map(k => activityByMonth[k]);

    const expectedResult = { labels: sortedKeys, datasets: [{ label: 'Activities', data: sortedValues }] };
    expect(res.data).toEqual(expectedResult);
  }, 10000);

  it('should return proper activity timeline report with filter by action', async () => {
    const action = faker.word.sample();
    const activities = await Promise.all([
      createActivity(apiToken, { action, time: faker.date.recent({ days: 90 }) }),
      createActivity(apiToken, { action, time: faker.date.recent({ days: 90 }) }),
    ]);

    await createActivity(apiToken, { time: faker.date.recent({ days: 90 }) });
    await wait(3000);

    const query = { action: activities.at(0).action };
    const [err, res] = await to(axios.get(`/api/reports/activity/timeline?${new URLSearchParams(query)}`));

    expect(err).toBeNull();
    expect(res.status).toEqual(200);

    const activityByMonth = activities.reduce((acc, activity) => {
      const month = dayjs(activity.time).format('MMM');
      acc[month] ||= 0;
      acc[month] += 1;
      return acc;
    }, {});

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedKeys = Object.keys(activityByMonth).sort((k1, k2) => months.indexOf(k1) - months.indexOf(k2));
    const sortedValues = sortedKeys.map(k => activityByMonth[k]);
    const expectedResult = { labels: sortedKeys, datasets: [{ label: 'Activities', data: sortedValues }] };

    expect(res.data).toHaveProperty('datasets');
    expect(res.data.datasets).toHaveLength(1);
    expect(res.data.datasets.at(0)).toHaveProperty('data');

    const totalCount = res.data.datasets.at(0).data.reduce((acc, val) => acc + val, 0);
    expect(totalCount).toBe(activities.length);
    expect(res.data).toEqual(expectedResult);
  }, 10000);
});
