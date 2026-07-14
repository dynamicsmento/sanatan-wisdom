import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setFontSize, addToast } from '../features/ui/uiSlice';
import { Sun, Moon, Type, Shield, Eye } from 'lucide-react';

export const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);
  const fontSize = useSelector(state => state.ui.fontSize);

  const handleFontSizeChange = (e) => {
    dispatch(setFontSize(Number(e.target.value)));
  };

  const handleSaveSettings = () => {
    dispatch(addToast({ type: 'success', message: 'Preferences updated and saved locally!' }));
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-accent">Preferences & Settings</h1>
        <p className="text-xs text-text/60 mt-1">Configure your display and reading aesthetics.</p>
      </div>

      <div className="bg-card border border-gold/25 rounded-xl shadow-soft p-6 space-y-6">
        {/* Reading Theme */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
            <Eye className="w-4 h-4" />
            <span>Display Theme</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (theme === 'dark') dispatch(toggleTheme());
              }}
              className={`p-4 border rounded-xl flex flex-col items-center space-y-2 transition-all ${
                theme === 'light'
                  ? 'border-primary bg-primary/5 text-accent font-semibold'
                  : 'border-gold/20 bg-background text-text/60 hover:bg-primary/5'
              }`}
            >
              <Sun className="w-5 h-5 text-primary" />
              <span className="text-xs">Peaceful Light</span>
            </button>
            <button
              onClick={() => {
                if (theme === 'light') dispatch(toggleTheme());
              }}
              className={`p-4 border rounded-xl flex flex-col items-center space-y-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5 text-accent font-semibold'
                  : 'border-gold/20 bg-background text-text/60 hover:bg-primary/5'
              }`}
            >
              <Moon className="w-5 h-5 text-accent" />
              <span className="text-xs">Spiritual Dark</span>
            </button>
          </div>
        </div>

        {/* Font Adjuster */}
        <div className="space-y-3 border-t border-gold/15 pt-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
            <Type className="w-4 h-4" />
            <span>Reading Font Size</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-text/70">
              <span>Font Size: {fontSize}px</span>
              <span className="text-4xs text-text/40 font-semibold uppercase tracking-wider">Range: 14px - 36px</span>
            </div>
            <input
              type="range"
              min="14"
              max="36"
              step="2"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-1.5 bg-text/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            {/* Live Preview block */}
            <div className="bg-background p-4 rounded-xl border border-gold/10 text-center font-serif leading-relaxed text-accent">
              <p style={{ fontSize: `${fontSize}px` }}>ॐ नमः शिवाय</p>
              <p className="text-3xs text-text/50 font-sans mt-2 font-semibold uppercase tracking-wider">Live Preview</p>
            </div>
          </div>
        </div>

        {/* Security & Data */}
        <div className="space-y-3 border-t border-gold/15 pt-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center space-x-1.5">
            <Shield className="w-4 h-4" />
            <span>Security & Cache</span>
          </h3>
          <div className="flex justify-between items-center bg-background/40 p-4 rounded-xl border border-gold/10">
            <div className="text-xs">
              <h4 className="font-semibold text-text">Local Storage cache</h4>
              <p className="text-3xs text-text/50 font-sans mt-0.5 leading-none">Stored progress, notes, and session tokens</p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                dispatch(addToast({ type: 'info', message: 'Local storage cache cleared. Reloading...' }));
                setTimeout(() => window.location.reload(), 1000);
              }}
              className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gold/15">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft saffron-hover"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
