import { configureStore } from '@reduxjs/toolkit';

import customerSliceReducer from './customer.slice';
import activitiesSliceReducer from '../pages/main/activity-list/activities.slice';
import insightsChartSliceReducer from '../pages/main/insights-chart/insights-chart.slice';
import apiTokenSliceReducer from '../pages/api-settings/api-token.slice';

export const store = configureStore({
  reducer: {
    customer: customerSliceReducer,
    activities: activitiesSliceReducer,
    insightsChart: insightsChartSliceReducer,
    apiToken: apiTokenSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
