import { request } from '../utils';

export class CustomerService {
  async getApiToken() {
    const resp = await request.get('/api/customers/profile/api-token');
    if (resp.status !== 200) {
      throw new Error(resp.data.message);
    }

    return resp.data;
  }
}
