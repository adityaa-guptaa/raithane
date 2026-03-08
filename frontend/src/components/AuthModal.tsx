import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import LoadingOverlay from './LoadingOverlay';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      onClose();
      
      // Small delay to ensure user state is updated before navigation
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname;
        
        // If there's a saved location and it's not the login/register page, go there
        if (from && from !== '/login' && from !== '/register') {
          navigate(from, { replace: true });
        } else {
          // Navigate to homepage - App.tsx will handle role-based redirects
          navigate('/', { replace: true });
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, firstName, lastName, ...rest } = registerData;
      await register({
        name: `${firstName} ${lastName}`.trim(),
        ...rest,
      });
      navigate('/');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message={mode === 'login' ? 'Logging in...' : 'Creating account...'} />}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex justify-center pt-4 pb-2">
          <div className="rounded-2xl p-2">
            <img src={logo} alt="Raithane Logo" className="h-12 w-auto object-contain" />
          </div>
        </div>

        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          {mode === 'login' ? "Nepal's Best Organic Marketplace" : "Create your account"}
        </DialogTitle>
        
        <DialogDescription className="text-center text-gray-600 text-sm">
          {mode === 'login' ? 'Sign in' : 'Sign up to get started'}
        </DialogDescription>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter email or username"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : 'Continue'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary underline">Terms of service</a> &{' '}
                <a href="#" className="text-primary underline">Privacy policy</a>
              </p>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="font-semibold p-0 h-auto"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First name"
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                required
                className="h-12"
              />
              <Input
                type="text"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <Input
              type="email"
              placeholder="Email address"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              className="h-12"
            />

            <div className="flex items-center border rounded-lg">
              <span className="px-3 text-gray-600">+977</span>
              <Input
                type="tel"
                placeholder="Enter mobile number"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="border-0 h-12"
              />
            </div>

            <Input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              className="h-12"
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              required
              className="h-12"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : 'Continue'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary underline">Terms of service</a> &{' '}
                <a href="#" className="text-primary underline">Privacy policy</a>
              </p>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="font-semibold p-0 h-auto"
                >
                  Log in
                </Button>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
