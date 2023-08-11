import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedSpace = ({ isAuthorized, redirectPath = '/login', children }) => {
  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
