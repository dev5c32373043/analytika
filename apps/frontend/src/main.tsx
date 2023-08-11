import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';

import { BrowserRouter } from 'react-router-dom';

import { store } from './app/store';
import { Provider } from 'react-redux';

import App from './app/app';

Sentry.init({
  enabled: import.meta.env.PROD,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [import.meta.env.VITE_SENTRY_TARGET],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_RATE,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
