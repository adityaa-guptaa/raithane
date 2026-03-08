import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

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

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
      onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="rounded-2xl p-4">
            <img src={logo} alt="Raithane Logo" className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? "Nepal's Best Organic Marketplace" : "Create your account"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {mode === 'login' ? 'Log in or Sign up' : 'Sign up to get started'}
          </p>
        </div>

        {/* Form Container */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <input
                    type="text"
                    placeholder="Enter email or username"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#992a16] hover:bg-[#7d2212] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Continue'}
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-[#992a16] underline">Terms of service</a> &{' '}
                  <a href="#" className="text-[#992a16] underline">Privacy policy</a>
                </p>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className="text-[#992a16] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                    <input
                      type="text"
                      placeholder="First name"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                    <input
                      type="text"
                      placeholder="Last name"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <span className="text-gray-600 mr-2">+977</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <input
                    type="password"
                    placeholder="Password"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#992a16] transition-colors">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#992a16] hover:bg-[#7d2212] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Continue'}
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-[#992a16] underline">Terms of service</a> &{' '}
                  <a href="#" className="text-[#992a16] underline">Privacy policy</a>
                </p>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="text-[#992a16] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
