import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { formatPrice } from '../../utils/formatters';
import Badge from '../Badge/Badge';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [ref, isVisible] = useIntersectionObserver();
  const inWishlist = isInWishlist(movie.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(movie);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(movie);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div 
        ref={ref}
        className={`${styles.card} ${styles[variant]} ${isVisible ? styles.visible : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/movie/${movie.id}`} className={styles.link}>
          {/* Poster Container */}
          <div className={styles.poster}>
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`}
              loading="lazy"
              className={`${styles.image} ${isHovered ? styles.zoomed : ''}`}
            />
            
            {/* Quick Action Buttons Overlay */}
            <div className={`${styles.overlay} ${isHovered ? styles.show : ''}`}>
              <button 
                className={`${styles.actionBtn} ${inWishlist ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label="Wishlist"
              >
                <FiHeart className={inWishlist ? styles.heartbeat : ''} />
              </button>

              <button 
                className={styles.actionBtn}
                onClick={handleQuickView}
                title="Quick View"
                aria-label="Quick view"
              >
                <FiEye />
              </button>

              <button 
                className={styles.actionBtn}
                onClick={handleAddToCart}
                title="Add to Cart"
                aria-label="Add to cart"
              >
                <FiShoppingCart />
              </button>
            </div>

            {/* Badges */}
            <div className={styles.badges}>
              {movie.discount > 0 && (
                <Badge variant="discount">-{movie.discount}%</Badge>
              )}
              {movie.newRelease && (
                <Badge variant="primary">NEW</Badge>
              )}
              {movie.bestseller && (
                <Badge variant="accent">HOT</Badge>
              )}
            </div>

            {/* Floating Rating Pill */}
            <div className={styles.ratingBadge}>
              <FiStar className={styles.starIcon} />
              <span>{movie.rating}</span>
            </div>
          </div>

          {/* Info Card Body */}
          <div className={styles.info}>
            {movie.genre && movie.genre[0] && (
              <span className={styles.genreTag}>{movie.genre[0]}</span>
            )}
            <h3 className={styles.title}>{movie.title}</h3>
            
            <div className={styles.bottomRow}>
              <span className={styles.year}>{movie.year}</span>
              <div className={styles.priceRow}>
                {movie.originalPrice > movie.price && (
                  <span className={styles.originalPrice}>{formatPrice(movie.originalPrice)}</span>
                )}
                <span className={styles.price}>{formatPrice(movie.price)}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {showQuickView && (
        <QuickViewModal movie={movie} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default MovieCard;
