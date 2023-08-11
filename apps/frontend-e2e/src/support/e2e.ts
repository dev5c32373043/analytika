// Import commands.js using ES2015 syntax:
import './commands';

import { GATEWAY_URL } from '../constants';

after(() => {
  // Removing all data that was created during the test run.
  cy.request('DELETE', `${GATEWAY_URL}/api/cleanup`);
});
