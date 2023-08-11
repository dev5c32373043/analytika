import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { customerService } from '../../services';

export interface ApiTokenState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  value: string;
}

const storeKey = '__api__';

export const fetchToken = createAsyncThunk('customer/apiToken', async () => customerService.getApiToken());

const initialState: ApiTokenState = { loading: 'idle', value: sessionStorage.getItem(storeKey) ?? '' };

export const apiTokenSlice = createSlice({
  name: 'apiToken',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchToken.pending, state => {
      state.loading = 'pending';
    });

    builder.addCase(fetchToken.fulfilled, (state, action) => {
      state.value = action.payload.value;
      sessionStorage.setItem(storeKey, action.payload.value);
      state.loading = 'succeeded';
    });

    builder.addCase(fetchToken.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message;
    });
  },
});

export default apiTokenSlice.reducer;
