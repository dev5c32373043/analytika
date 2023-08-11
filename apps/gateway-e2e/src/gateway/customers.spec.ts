import axios from 'axios';
import { faker } from '@faker-js/faker';

import { createCustomer, generatePasscode } from '../support/helpers';
import { to } from '../support/utils';

describe('Customers', () => {
  describe('POST /api/customers/auth/sign-in', () => {
    it('should return a proper data when the customer logs in', async () => {
      const passcode = generatePasscode();
      const customer = await createCustomer({ passcode });

      const [err, res] = await to(axios.post('/api/customers/auth/sign-in', { email: customer.email, passcode }));

      expect(err).toBeNull();
      expect(res.status).toEqual(200);
      expect(res.data).toHaveProperty('accessToken');
      expect(res.data).not.toHaveProperty('passcode');
      expect(res.data).toMatchObject({ id: customer.id, name: customer.name, email: customer.email });
    });

    it('should return 401 when the passcode is wrong', async () => {
      const passcode = generatePasscode();
      const customer = await createCustomer({ passcode });
      const payload = { email: customer.email, passcode: generatePasscode() };
      const [err] = await to(axios.post('/api/customers/auth/sign-in', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(401);
      expect(err.response.data?.message).toBe('Please check your login credentials');
    });

    it('should return 401 when the email is wrong', async () => {
      const passcode = generatePasscode();
      await createCustomer({ passcode });

      const payload = { email: faker.internet.email(), passcode };
      const [err] = await to(axios.post('/api/customers/auth/sign-in', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(401);
      expect(err.response.data?.message).toBe('Please check your login credentials');
    });
  });

  describe('POST /api/customers/auth/sign-up', () => {
    it('should return a proper data when the customer signs up', async () => {
      const payload = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        passcode: generatePasscode(),
      };

      const [err, res] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).toBeNull();
      expect(res.status).toEqual(201);
      expect(res.data).toHaveProperty('accessToken');
      expect(res.data).not.toHaveProperty('passcode');
      expect(res.data).toMatchObject({ name: payload.name, email: payload.email });
    });

    it('should return 400 when email is missing', async () => {
      const payload = {
        name: faker.internet.userName(),
        passcode: generatePasscode(),
      };

      const [err] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual(['email should not be empty', 'email must be an email']);
    });

    it('should return 400 when passcode is weak', async () => {
      const payload = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        passcode: 'passcode',
      };

      const [err] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual([
        'passcode should be at least 8 characters, at least one uppercase letter and one number',
      ]);
    });

    it('should return 400 when passcode is missing', async () => {
      const payload = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
      };

      const [err] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual([
        'passcode should be at least 8 characters, at least one uppercase letter and one number',
        'passcode must be a string',
      ]);
    });

    it('should return 400 when name is missing', async () => {
      const payload = {
        email: faker.internet.email(),
        passcode: generatePasscode(),
      };

      const [err] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual(['name should not be empty', 'name must be a string']);
    });

    it('should return 400 when email already taken', async () => {
      const customer = await createCustomer();

      const payload = {
        name: faker.internet.userName(),
        email: customer.email,
        passcode: generatePasscode(),
      };

      const [err] = await to(axios.post('/api/customers/auth/sign-up', payload));

      expect(err).not.toBeNull();
      expect(err.response.status).toEqual(400);
      expect(err.response.data.message).toEqual('Email already in use!');
    });
  });

  describe('DELETE /api/customers/auth/logout', () => {
    it('should remove access for the customer', async () => {
      const customer = await createCustomer();

      const [err, res] = await to(
        axios.delete('/api/customers/auth/logout', { headers: { Authorization: `Bearer ${customer.accessToken}` } }),
      );

      expect(err).toBeNull();
      expect(res.status).toEqual(200);

      const [fetchErr] = await to(
        axios.get('/api/activities', { headers: { Authorization: `Bearer ${customer.accessToken}` } }),
      );
      expect(fetchErr).not.toBeNull();
      expect(fetchErr.response.status).toEqual(401);
    });
  });

  describe('GET /api/customers/profile/api-token', () => {
    it('should return apiToken', async () => {
      const customer = await createCustomer();
      const [err, res] = await to(
        axios.get('/api/customers/profile/api-token', { headers: { Authorization: `Bearer ${customer.accessToken}` } }),
      );

      expect(err).toBeNull();
      expect(res.status).toEqual(200);
      expect(res.data).toHaveProperty('value');

      const uuidv4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      expect(res.data.value).toMatch(uuidv4Regex);
    });
  });
});
