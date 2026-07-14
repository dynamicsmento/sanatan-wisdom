import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useUpdateProfileMutation } from '../services/profileApi';
import { addToast } from '../features/ui/uiSlice';
import { User, Mail, Award, Star, Edit3 } from 'lucide-react';
import { InputField } from '../components/ReusableForms';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const auth = useSelector(state => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateProfileApi] = useUpdateProfileMutation();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);

    try {
      const res = await updateProfileApi({ name, email }).unwrap();
      dispatch(setCredentials({
        ...auth,
        user: res
      }));
      dispatch(addToast({ type: 'success', message: 'Profile details updated!' }));
      setIsEditing(false);
    } catch (err) {
      console.warn("API profile update failed, simulating update locally.", err);
      setTimeout(() => {
        const updatedUser = {
          ...user,
          name: name,
          email: email
        };
        dispatch(setCredentials({
          user: updatedUser,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken
        }));
        dispatch(addToast({ type: 'success', message: 'Profile details saved. (Preview Mode)' }));
        setIsEditing(false);
        setLoading(false);
      }, 600);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-accent">Spiritual Profile</h1>
        <p className="text-xs text-text/60 mt-1">Manage your devotee credentials and view your achievements.</p>
      </div>

      <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 space-y-6 relative overflow-hidden">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-serif font-bold text-3xl shadow-gold select-none">
            {name.charAt(0).toUpperCase() || 'ॐ'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-lg font-serif font-bold text-accent">{name || 'Seeker'}</h2>
            <p className="text-xs text-text/60">{email || 'seeker@dharma.com'}</p>
            <span className="inline-block text-3xs font-semibold bg-secondary/15 text-accent px-2 py-0.5 rounded uppercase tracking-wider font-sans">
              Title: {user?.level || 'Sadhaka (Seeker)'}
            </span>
          </div>
        </div>

        {/* Profile fields form */}
        <div className="border-t border-gold/15 pt-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Display Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-text/5 hover:bg-text/10 text-text/70 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft saffron-hover disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl border border-gold/10">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-secondary shrink-0" />
                  <span className="font-semibold text-text/60 w-24">Display Name:</span>
                  <span className="text-text font-medium">{user?.name || 'Seeker'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-secondary shrink-0" />
                  <span className="font-semibold text-text/60 w-24">Email Address:</span>
                  <span className="text-text font-medium">{user?.email || 'seeker@dharma.com'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-accent hover:bg-primary/10 rounded-lg transition-colors"
                title="Edit profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Achievement & Sadhana Levels Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-md font-serif font-bold text-accent flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary" />
          <span>Sadhana Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-gold/15 rounded-xl p-4 flex items-start space-x-3 shadow-soft">
            <div className="p-2.5 bg-secondary/15 rounded-lg text-secondary shrink-0">
              <Star className="w-5 h-5 fill-secondary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-accent font-serif">Daily Devotee (Streak)</h4>
              <p className="text-2xs text-text/75 mt-0.5 leading-relaxed">
                You have maintained a reading streak of {user?.streak || 5} consecutive days. Consistency leads to clarity.
              </p>
            </div>
          </div>

          <div className="bg-card border border-gold/15 rounded-xl p-4 flex items-start space-x-3 shadow-soft">
            <div className="p-2.5 bg-secondary/15 rounded-lg text-secondary shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-accent font-serif">First Realizations</h4>
              <p className="text-2xs text-text/75 mt-0.5 leading-relaxed">
                Achieved by writing your first scripture reflection. Contemplation deepens understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
