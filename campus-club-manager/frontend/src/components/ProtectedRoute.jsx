import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Loader from './Loader.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
