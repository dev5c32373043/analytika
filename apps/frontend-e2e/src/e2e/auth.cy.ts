import { faker } from '@faker-js/faker';
import { generatePasscode } from '../support/app.po';

import { Customer } from './interfaces';

describe('Auth', () => {
  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should login the customer with valid credentials', () => {
      cy.get('h2').contains('Login');

      const email = faker.internet.email();
      const passcode = generatePasscode();
      cy.createCustomer({ email, passcode });

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="passcode"]').type(passcode);
      cy.get('button[type="submit"]').click();

      cy.location('pathname').should('eq', '/');
    });

    it('should show error messages when required fields are empty', () => {
      cy.get('button[type="submit"]').click();

      cy.get('small#customer-email-err.visible').contains('Please provide correct email, e.g user@mail.com');
      cy.get('small#passcode-err.visible').contains(
        'Passcode should be at least 8 characters, at least one uppercase letter and one number',
      );

      cy.location('pathname').should('eq', '/login');
    });

    it('should redirect customer to /login page when unauthorized', () => {
      cy.visit('/');
      cy.location('pathname').should('eq', '/login');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should logout the customer', () => {
      const email = faker.internet.email();
      const passcode = generatePasscode();
      cy.createCustomer({ email, passcode });

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="passcode"]').type(passcode);
      cy.get('button[type="submit"]').click();

      cy.location('pathname').should('eq', '/');

      cy.get('nav button[aria-label="Toggle navigation"]').click();
      cy.get('nav ul li').contains('Logout').click();

      cy.location('pathname').should('eq', '/login');
      cy.visit('/');
      cy.location('pathname').should('eq', '/login');
    });
  });

  describe('Sign Up', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });

    it('should sign up the customer with valid name, email, passcode', () => {
      cy.get('h2').contains('Sign Up');

      cy.get('input[name="name"]').type(faker.internet.userName());
      cy.get('input[name="email"]').type(faker.internet.email());
      cy.get('input[name="passcode"]').type(generatePasscode());
      cy.get('button[type="submit"]').click();

      cy.location('pathname').should('eq', '/');
    });

    it('should show error messages when required fields are empty', () => {
      cy.get('button[type="submit"]').click();

      cy.location('pathname').should('eq', '/signup');

      cy.get('small#customer-name-err.visible').contains('Provide your name. Even fictional will do');
      cy.get('small#customer-email-err.visible').contains('Please provide correct email, e.g user@mail.com');
      cy.get('small#passcode-err.visible').contains(
        'Passcode should be at least 8 characters, at least one uppercase letter and one number',
      );
    });

    it('should show an error when email is already taken', () => {
      cy.createCustomer();

      cy.get('@customer').then((otherCustomer: Customer) => {
        cy.get('input[name="name"]').type(faker.internet.userName());
        cy.get('input[name="email"]').type(otherCustomer.email);
        cy.get('input[name="passcode"]').type(generatePasscode());
        cy.get('button[type="submit"]').click();

        cy.location('pathname').should('eq', '/signup');

        cy.get('span#signup-form-error.visible').contains('Email already in use!');
      });
    });
  });
});
