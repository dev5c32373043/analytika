export interface ActivityTimelineReport {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

export interface ActivityTimelineFilter {
  tenantId: string;
  action?: string;
  $or?: any[];
}
