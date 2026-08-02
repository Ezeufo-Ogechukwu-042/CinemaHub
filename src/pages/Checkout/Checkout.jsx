import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiSmartphone, FiGlobe, FiTruck, FiPackage, FiShield } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/Formatters';
import Button from '../../components/Button/Button';
import styles from './Checkout.module.css';
import EmptyState from '../../components/EmptyState/EmptyState';

const steps = [
  { id: 'shipping', label: 'Shipping', icon: FiTruck },
  { id: 'payment', label: 'Payment', icon: FiCreditCard },
  { id: 'review', label: 'Review', icon: FiPackage },
];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState('shipping');
  const [completed, setCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const handleNext = () => {
    if (isSubmittingOrder) {
      return;
    }

    if (step === 'shipping') {
      setStep('payment');
      return;
    }

    if (step === 'payment') {
      setStep('review');
      return;
    }

    setIsSubmittingOrder(true);
    setCompleted(true);
    clearCart();
    setTimeout(() => navigate('/'), 3000);
  };

  if (cart.length === 0 && !completed) {
    return <EmptyState />;
  }

  if (completed) {
    return (
      <div className={styles.success}>
        <div className={styles.checkmark}>
          <FiCheck />
        </div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. You will be redirected to the home page shortly.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        {/* Stepper */}
        <div className={styles.stepper}>
          {steps.map((s, i) => (
            <div key={s.id} className={`${styles.step} ${step === s.id ? styles.active : ''} ${i < steps.findIndex(x => x.id === step) ? styles.done : ''}`}>
              <div className={styles.stepIcon}>
                <s.icon />
              </div>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.form}>
            {step === 'shipping' && (
              <div className={styles.section}>
                <h3>Shipping Information</h3>
                <div className={styles.grid2}>
                  <input className={styles.input} placeholder="First Name" />
                  <input className={styles.input} placeholder="Last Name" />
                </div>
                <input className={styles.input} placeholder="Email Address" />
                <input className={styles.input} placeholder="Street Address" />
                <div className={styles.grid3}>
                  <input className={styles.input} placeholder="City" />
                  <input className={styles.input} placeholder="State" />
                  <input className={styles.input} placeholder="ZIP Code" />
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className={styles.section}>
                <h3>Payment Method</h3>
                <div className={styles.paymentMethods}>
                  <button 
                    className={`${styles.method} ${paymentMethod === 'card' ? styles.active : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <FiCreditCard /> Credit Card
                  </button>
                  <button 
                    className={`${styles.method} ${paymentMethod === 'paypal' ? styles.active : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <FiGlobe /> PayPal
                  </button>
                  <button 
                    className={`${styles.method} ${paymentMethod === 'apple' ? styles.active : ''}`}
                    onClick={() => setPaymentMethod('apple')}
                  >
                    <FiSmartphone /> Apple Pay
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className={styles.cardForm}>
                    <input className={styles.input} placeholder="Card Number" />
                    <div className={styles.grid2}>
                      <input className={styles.input} placeholder="MM/YY" />
                      <input className={styles.input} placeholder="CVC" />
                    </div>
                    <input className={styles.input} placeholder="Cardholder Name" />
                  </div>
                )}
              </div>
            )}

            {step === 'review' && (
              <div className={styles.section}>
                <h3>Order Review</h3>
                {cart.map(item => (
                  <div key={item.id} className={styles.reviewItem}>
                    <img src={item.poster} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            <Button variant="primary" size="large" onClick={handleNext} className={styles.nextBtn} disabled={isSubmittingOrder}>
              {isSubmittingOrder ? 'Processing Order...' : step === 'review' ? 'Place Order' : 'Continue'}
            </Button>
          </div>

          <div className={styles.sidebar}>
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} className={styles.sidebarItem}>
                <span>{item.title} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className={styles.sidebarRow}>
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className={styles.sidebarRow}>
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className={`${styles.sidebarRow} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className={styles.secure}>
              <FiShield /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;