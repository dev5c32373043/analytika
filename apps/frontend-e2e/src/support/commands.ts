import { faker } from '@faker-js/faker';
import { GATEWAY_URL, ACTIVITIES_URL } from '../constants';

import { generatePasscode } from './app.po';

import { CustomerData, ActivityData } from './interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

Cypress.Commands.add('createCustomer', (data: Partial<CustomerData> = {}) => {
  cy.request('POST', `${GATEWAY_URL}/api/customers/auth/sign-up`, {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    passcode: generatePasscode(),
    ...data,
  }).then(resp => {
    cy.wrap(resp.body).as('customer');
  });
});

Cypress.Commands.add('getApiToken', (accessToken: string) => {
  cy.request({
    method: 'GET',
    url: `${GATEWAY_URL}/api/customers/profile/api-token`,
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(resp => {
    cy.wrap(resp.body).as('apiToken');
  });
});

Cypress.Commands.add('createActivity', (apiToken: string, localId: string, data: Partial<ActivityData> = {}) => {
  cy.request({
    method: 'POST',
    url: `${ACTIVITIES_URL}/api/activities`,
    body: {
      action: faker.lorem.word(),
      username: faker.internet.userName(),
      time: faker.date.recent(),
      value: faker.number.int({ min: 1, max: 100 }),
      ...data,
    },
    headers: { 'content-type': 'application/json', 'api-token': apiToken },
  }).then(resp => {
    cy.wrap(resp.body).as(`activity${localId}`);
  });
});

Cypress.Commands.add('createAndLogin', (_email, _password) => {
  cy.visit('/login');

  const email = _email ?? faker.internet.email();
  const passcode = _password ?? generatePasscode();
  cy.createCustomer({ email, passcode });

  cy.get('input[name="email"]').type(email);
  cy.get('input[name="passcode"]').type(passcode);
  cy.get('button[type="submit"]').click();
  cy.location('pathname').should('eq', '/');
});

Cypress.Commands.add('setupActivity', (localId = '') => {
  cy.get('@customer').then((customer: Customer) => {
    cy.getApiToken(customer.accessToken);

    cy.get('@apiToken').then(apiToken => {
      cy.createActivity(apiToken.value, localId);
    });
  });
});
