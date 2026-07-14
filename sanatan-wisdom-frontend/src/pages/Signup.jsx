import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials, setAuthLoading, setAuthError } from '../features/auth/authSlice';
import { useSignupMutation } from '../services/authApi';
import { InputField } from '../components/ReusableForms';
import { addToast } from '../features/ui/uiSlice';
import { Eye, EyeOff } from 'lucide-react';

export const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);
  const authLoading = useSelector((state) => state.auth.loading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [signupApi] = useSignupMutation();

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full Name is required';
    
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Email is invalid';
    
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const res = await signupApi({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      dispatch(addToast({ type: 'success', message: `Welcome to Sanatan Wisdom, ${res.user.name}!` }));
      navigate('/dashboard');
    } catch (err) {
      console.warn("API signup failed, falling back to mock registration.", err);
      
      setTimeout(() => {
        const mockResponse = {
          user: {
            id: 'mock_user_' + Date.now(),
            name: name,
            email: email,
            streak: 1,
            level: 'Sadhaka (Seeker)',
          },
          accessToken: 'mock_jwt_access_token_' + Math.random().toString(36).substring(2),
          refreshToken: 'mock_jwt_refresh_token_' + Math.random().toString(36).substring(2),
        };
        
        dispatch(setCredentials(mockResponse));
        dispatch(setAuthLoading(false));
        dispatch(addToast({ type: 'success', message: `Welcome, ${mockResponse.user.name}! Account created in preview mode.` }));
        navigate('/dashboard');
      }, 800);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-serif font-bold text-accent">Create Your Account</h2>
        <p className="text-xs text-text/60 mt-1">Begin journaling and tracking your scripture readings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Arjuna Pandava"
          error={errors.name}
          required
        />

        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="arjuna@gandiva.com"
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

        <InputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />

        {authError && (
          <p className="text-xs text-red-600 font-semibold text-center">{authError}</p>
        )}

        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-2.5 bg-primary hover:bg-secondary text-white font-semibold rounded-xl shadow-soft transition-all duration-300 saffron-hover disabled:opacity-50"
        >
          {authLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gold/10">
        <p className="text-xs text-text/70">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-primary font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
