import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

export default function RegisterPage() {
  const { user, loading, isAdmin, isDelivery } = useAuth();
  const { openRegister } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isDelivery) {
        navigate('/delivery', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else if (!loading && !user) {
      openRegister();
      navigate('/', { replace: true });
    }
  }, [user, loading, isAdmin, isDelivery, navigate, openRegister]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
