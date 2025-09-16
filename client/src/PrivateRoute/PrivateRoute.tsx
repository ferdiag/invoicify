import { useUserStore } from '../store/userStore';
import { Navigate, Outlet } from 'react-router-dom';

const IsAuthenticated = () => {
  const { token } = useUserStore();
  return !!token;
};

const PrivateRoute = () => {
  return IsAuthenticated() ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
