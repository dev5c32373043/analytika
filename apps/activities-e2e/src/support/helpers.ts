import axios from 'axios';
import { faker } from '@faker-js/faker';

import { GATEWAY_URL } from '../constants';

export async function createCustomer() {
  const resp = await axios.post(`${GATEWAY_URL}/api/customers/auth/sign-up`, {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    passcode: faker.internet.password({ length: 10, pattern: /^[a-zA-Z0-9]+$/, prefix: 'A1' }),
  });

  return resp.data;
}

export async function getApiToken(accessToken: string) {
  const resp = await axios.get(`${GATEWAY_URL}/api/customers/profile/api-token`, {
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

export async function createActivity(data: Partial<ActivityData> = {}, apiToken?: string) {
  const payload = {
    action: `${faker.word.verb()} ${faker.word.noun()}`,
    username: faker.internet.userName(),
    time: faker.date.recent(),
    value: faker.number.int({ min: 1, max: 100 }),
    ...data,
  };

  const opts = apiToken ? { headers: { 'api-token': apiToken } } : {};
  const resp = await axios.post('/api/activities', payload, opts);
  return resp.data;
}
