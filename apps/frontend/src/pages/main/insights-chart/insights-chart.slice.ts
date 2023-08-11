import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { reportsService } from '../../../services';

export interface InsightsChartState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  data: { labels: string[]; datasets: { label: string[]; data: number[] }[] };
}

export const fetchReport = createAsyncThunk('chart/fetch-report', async (query = {}) =>
  reportsService.activityTimeline(query),
);

const initialState: InsightsChartState = { loading: 'idle', data: { labels: [], datasets: [] } };

export const insightsChartSlice = createSlice({
  name: 'insightsChart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchReport.pending, state => {
      state.loading = 'pending';
    });

    builder.addCase(fetchReport.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });

    builder.addCase(fetchReport.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message;
    });
  },
});

export default insightsChartSlice.reducer;
