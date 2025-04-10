import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, hasRole, hasValidToken, refreshAccessToken, user } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // check if token refresh is possible (only for regular users)
        if (!hasValidToken() && user?.role === 'user') {
          const newToken = await refreshAccessToken();
          // refresh failed -> login
          if (!newToken) {
            navigate('/login');
            return;
          }
        } else if (!hasValidToken()) {
          // Non-user roles or no token -> redirect to login
          navigate('/login');
          return;
        }

        // Check authentication state
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        // If no specific roles are required, just check for authentication
        if (allowedRoles.length === 0) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check if user's role is in the allowed roles
        const hasAllowedRole = allowedRoles.some(role => hasRole(role));
        if (hasAllowedRole) {
          setIsAuthorized(true);
        } else {
          navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles, isAuthenticated, hasRole, hasValidToken, refreshAccessToken, user]);

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 