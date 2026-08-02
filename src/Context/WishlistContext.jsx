import React, { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinemahub-wishlist')) || [];
    } catch {
      return [];
    }
  });

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('cinemahub-wishlist', JSON.stringify(newWishlist));
  };

  const addToWishlist = useCallback((movie) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === movie.id)) return prev;
      const newList = [...prev, movie];
      localStorage.setItem('cinemahub-wishlist', JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist(prev => {
      const newList = prev.filter(item => item.id !== id);
      localStorage.setItem('cinemahub-wishlist', JSON.stringify(newList));
      return newList;
    });
  }, []);

  const isInWishlist = useCallback((id) => {
    return wishlist.some(item => item.id === id);
  }, [wishlist]);

  const toggleWishlist = useCallback((movie) => {
    if (isInWishlist(movie.id)) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};