import { Customer } from '../support/interfaces';

describe('API Settings page', () => {
  beforeEach(() => {
    cy.createAndLogin();
  });

  it('should be possible to copy api token into clipboard', () => {
    cy.get('nav button[aria-label="Toggle navigation"]').click();
    cy.get('nav ul li a').contains('API Settings').click();

    cy.get('@customer').then((customer: Customer) => {
      cy.getApiToken(customer.accessToken);

      cy.get('@apiToken').then(apiToken => {
        cy.get('input#api-token').should('have.value', apiToken.value);
      });
    });
  });
});
