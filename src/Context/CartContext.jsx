import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinemahub-cart')) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cinemahub-cart', JSON.stringify(newCart));
  };

  const addToCart = useCallback((movie) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === movie.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item.id === movie.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...movie, quantity: 1 }];
      }
      localStorage.setItem('cinemahub-cart', JSON.stringify(newCart));
      return newCart;
    });
    showToast(`${movie.title} added to cart`);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('cinemahub-cart', JSON.stringify(newCart));
      return newCart;
    });
    showToast('Removed from cart');
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem('cinemahub-cart', JSON.stringify(newCart));
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('cinemahub-cart');
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, toast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

