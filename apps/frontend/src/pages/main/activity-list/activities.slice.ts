import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { activitiesService } from '../../../services';

export interface ActivitiesState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  moreToLoad: boolean;
  limit: number;
  records: [{ id: number; action: string; username: string; time: string; value?: number }];
}

export const fetchActivities = createAsyncThunk('activities/fetch', async (query = {}) =>
  activitiesService.list(query),
);

export const loadMore = createAsyncThunk('activities/load-more', async (query = {}) => activitiesService.list(query));

const initialState: ActivitiesState = { loading: 'idle', limit: 3, moreToLoad: false, records: [] };

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: builder => {
    ['fetchActivities', 'loadMore'].forEach(type => {
      const subject = type === 'loadMore' ? loadMore : fetchActivities;

      builder.addCase(subject.pending, state => {
        state.loading = 'pending';
      });

      builder.addCase(subject.fulfilled, (state, action) => {
        if (type === 'loadMore') {
          state.records.push(...action.payload);
        }

        if (type === 'fetchActivities') {
          state.records = action.payload;
        }

        state.moreToLoad = action.payload.length === state.limit;
        state.loading = 'succeeded';
      });

      builder.addCase(subject.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
    });
  },
});

export default activitiesSlice.reducer;
