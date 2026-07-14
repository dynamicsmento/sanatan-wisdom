import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search scriptures, chapters, or verses...' }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/40">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-card border border-gold/30 rounded-xl shadow-soft focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-text placeholder-text/45 font-sans"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text/40 hover:text-text/75 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
