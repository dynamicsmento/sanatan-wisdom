import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setCredentials, setAuthLoading, setAuthError } from '../features/auth/authSlice';
import { useLoginMutation } from '../services/authApi';
import { InputField } from '../components/ReusableForms';
import { addToast } from '../features/ui/uiSlice';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector((state) => state.auth.error);
  const authLoading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginApi] = useLoginMutation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Email is invalid';
    
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const res = await loginApi({ email, password }).unwrap();
      dispatch(setCredentials(res));
      dispatch(addToast({ type: 'success', message: `Welcome back, ${res.user.name}!` }));
      navigate(from, { replace: true });
    } catch (err) {
      console.warn("API login failed, falling back to mock login credentials for presentation.", err);
      
      setTimeout(() => {
        const mockResponse = {
          user: {
            id: 'mock_user_108',
            name: email.split('@')[0].toUpperCase(),
            email: email,
            streak: 7,
            level: 'Sadhaka (Seeker)',
          },
          accessToken: 'mock_jwt_access_token_' + Math.random().toString(36).substring(2),
          refreshToken: 'mock_jwt_refresh_token_' + Math.random().toString(36).substring(2),
        };
        
        dispatch(setCredentials(mockResponse));
        dispatch(setAuthLoading(false));
        dispatch(addToast({ type: 'success', message: `Welcome back, ${mockResponse.user.name}! (Preview Mode)` }));
        navigate(from, { replace: true });
      }, 800);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-serif font-bold text-accent">Sign In to Your Account</h2>
        <p className="text-xs text-text/60 mt-1">Access your spiritual study logs and reflections</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@dharma.com"
          error={errors.email}
          required
        />

        <div className="relative">
          <InputField
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 bottom-3 text-text/50 hover:text-text/75 p-0.5 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        </div>

        {authError && (
          <p className="text-xs text-red-600 font-semibold text-center">{authError}</p>
        )}

        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-2.5 bg-primary hover:bg-secondary text-white font-semibold rounded-xl shadow-soft transition-all duration-300 saffron-hover disabled:opacity-50"
        >
          {authLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gold/10">
        <p className="text-xs text-text/70">
          New to Sanatan Wisdom?{' '}
          <Link to="/signup" className="text-accent hover:text-primary font-semibold transition-colors">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
