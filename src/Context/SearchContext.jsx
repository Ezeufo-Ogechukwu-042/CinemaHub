import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinemahub-recent-searches')) || [];
    } catch {
      return [];
    }
  });

  const addRecentSearch = (query) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const newList = [query, ...filtered].slice(0, 10);
      localStorage.setItem('cinemahub-recent-searches', JSON.stringify(newList));
      return newList;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('cinemahub-recent-searches');
  };

  return (
    <SearchContext.Provider value={{
      searchQuery, setSearchQuery, recentSearches, addRecentSearch, clearRecentSearches
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};
