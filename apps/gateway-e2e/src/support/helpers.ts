import axios from 'axios';
import { faker } from '@faker-js/faker';

import { ACTIVITIES_URL } from '../constants';

export const generatePasscode = () => faker.internet.password({ length: 10, pattern: /^[a-zA-Z0-9]+$/, prefix: 'G1' });

interface CustomerData {
  name: string;
  email: string;
  passcode: string;
}

export async function createCustomer(data: Partial<CustomerData> = {}) {
  const resp = await axios.post('/api/customers/auth/sign-up', {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    passcode: generatePasscode(),
    ...data,
  });

  return resp.data;
}

export async function getApiToken(accessToken: string) {
  const resp = await axios.get('/api/customers/profile/api-token', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return resp.data.value;
}

interface ActivityData {
  id: string;
  action: string;
  username: string;
  value: number;
  time: Date;
}

export async function createActivity(apiToken: string, data: Partial<ActivityData> = {}) {
  const payload = {
    action: `${faker.word.verb()} ${faker.word.noun()}`,
    username: faker.internet.userName(),
    time: faker.date.recent(),
    value: faker.number.int({ min: 1, max: 100 }),
    ...data,
  };

  const opts = apiToken ? { headers: { 'api-token': apiToken } } : {};
  const resp = await axios.post(`${ACTIVITIES_URL}/api/activities`, payload, opts);
  return resp.data;
}
