import { request } from '../utils';

interface ListQuery {
  action: string;
  search: string;
  $limit: number;
  order: string;
}

export class ActivitiesService {
  async list(query?: Partial<ListQuery>) {
    let endpoint = '/api/activities';
    if (query) {
      endpoint += `?${new URLSearchParams(query)}`;
    }

    const resp = await request.get(endpoint);
    if (resp.status !== 200) {
      throw new Error(resp.data.message);
    }

    return resp.data;
  }
}
