import { request } from '../utils';

export class ReportsService {
  async activityTimeline(query: { action: string }) {
    let endpoint = '/api/reports/activity/timeline';
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
