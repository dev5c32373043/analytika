import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { authService } from '../services';
import { safeParseJson, history } from '../utils';

export interface CustomerState {
  loading: 'idle' | 'pending' | 'failed';
  error: string | null;
  record: { id: number; name: string; email: string; accessToken: string };
}

export const login = createAsyncThunk('customer/login', async data => authService.login(data));
export const signUp = createAsyncThunk('customer/signup', async data => authService.signUp(data));
export const logout = createAsyncThunk('customer/logout', async () => authService.logout());

const customerStoreKey = '__customer';
const apiTokenStoreKey = '__api__';

const initialState: CustomerState = { loading: 'idle', record: safeParseJson(localStorage.getItem(customerStoreKey)) };

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetError: (state, action: PayloadAction<CustomerState>) => {
      state.error = null;
      state.loading = 'idle';
    },
  },
  extraReducers: builder => {
    ['login', 'signUp'].forEach(type => {
      const subject = type === 'login' ? login : signUp;

      builder.addCase(subject.pending, state => {
        state.loading = 'pending';
      });

      builder.addCase(subject.fulfilled, (state, action) => {
        state.record = action.payload;
        localStorage.setItem(customerStoreKey, JSON.stringify(action.payload));
        state.loading = 'idle';

        const { from } = history.location.state || { from: { pathname: '/' } };
        history.navigate(from);
      });

      builder.addCase(subject.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
    });

    builder.addCase(logout.pending, state => {
      state.loading = 'pending';
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      state.record = action.payload;
      sessionStorage.removeItem(apiTokenStoreKey);
      localStorage.removeItem(customerStoreKey);
      state.loading = 'idle';

      const { from } = history.location.state || { from: { pathname: '/' } };
      history.navigate('/login', { state: { from } });
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.loading = 'idle';
      state.error = action.error.message;
    });
  },
});

export const { resetError } = customerSlice.actions;
export default customerSlice.reducer;
