import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiTag, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/Formatters';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 50 ? 0 : 4.99;
  const finalTotal = cartTotal - discount + tax + shipping;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'cinema20') {
      setDiscount(cartTotal * 0.2);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Looks like you haven't added any movies to your cart yet."
          action={<Link to="/movies"><Button>Browse Movies</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart</h1>
        
        <div className={styles.layout}>
          <div className={styles.items}>
            <div className={styles.header}>
              <span>{cart.length} items</span>
              <button className={styles.clear} onClick={clearCart}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>

            {cart.map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.poster} alt={item.title} className={styles.poster} />
                <div className={styles.details}>
                  <h3 className={styles.itemTitle}>
                    <Link to={`/movie/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className={styles.meta}>{item.year} • {item.genre[0]}</p>
                  <div className={styles.price}>{formatPrice(item.price)}</div>
                </div>
                <div className={styles.quantity}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <div className={styles.total}>{formatPrice(item.price * item.quantity)}</div>
                <button 
                  className={styles.remove}
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <Link to="/movies" className={styles.continue}>
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>

          <div className={styles.summary}>
            <h3>Order Summary</h3>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className={styles.row}>
              <span>Discount</span>
              <span style={{ color: 'var(--success)' }}>-{formatPrice(discount)}</span>
            </div>
            <div className={styles.row}>
              <span>Estimated Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className={`${styles.row} ${styles.grandTotal}`}>
              <span>Grand Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>

            <div className={styles.promo}>
              <FiTag />
              <input 
                type="text" 
                placeholder="Promo code (try: CINEMA20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromo}>Apply</button>
            </div>

            <Link to="/checkout">
              <Button variant="primary" size="large" className={styles.checkout}>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;