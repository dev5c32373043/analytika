import { faker } from '@faker-js/faker';

export const generatePasscode = (): string =>
  faker.internet.password({ length: 10, pattern: /^[a-zA-Z0-9]+$/, prefix: 'F1' });
