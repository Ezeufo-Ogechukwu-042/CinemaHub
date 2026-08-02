import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const { toast } = useCart();

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => {}} 
        />
      )}
    </div>
  );
};

export default MainLayout;