import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { MainPage, ApiSettingsPage, LoginPage, SignUpPage } from '../pages';
import { ErrorBoundary } from '../components';

import { ProtectedSpace } from './protected-space';

import { history, isEmpty } from '../utils';

export function App() {
  // Init custom history object to allow navigation outside of components
  history.navigate = useNavigate();
  history.location = useLocation();

  const customer = useSelector(state => state.customer);
  const isAuthorized = !isEmpty(customer?.record?.accessToken);

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<ProtectedSpace isAuthorized={isAuthorized} />}>
          <Route path="/" Component={MainPage} />
          <Route path="/api-settings" Component={ApiSettingsPage} />
        </Route>

        <Route element={<ProtectedSpace isAuthorized={!isAuthorized} redirectPath="/" />}>
          <Route path="/login" Component={LoginPage} />
          <Route path="/signup" Component={SignUpPage} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
