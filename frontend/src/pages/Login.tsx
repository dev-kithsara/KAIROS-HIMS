import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const loginMutation = useLogin();

  // 2. Destructure the 'login' function from our Auth Context
  const { login: contextLogin } = useAuthContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setErrorMsg(''); // Clear any previous errors

    // Basic frontend validation
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Call the mutation
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // 4. Call the context login function instead of manual localStorage
          // This updates the global state and saves to localStorage internally
          contextLogin(data.user, data.token);
          
          // If login is successful, check the role and navigate accordingly
          if (data.user.role === 'INVESTIGATOR') {
            navigate('/investigator');
          } else if (data.user.role === 'ACTION_OWNER') {
            navigate('/action-owner');
          } else {
            navigate('/');
          }
        },
        onError: (error: any) => {
          // Extract the error message from the Axios response
          const message = error.response?.data?.message || 'Login failed. Please try again.';
          setErrorMsg(message);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          KAIROS HIMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hospital Incident Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message Box */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};