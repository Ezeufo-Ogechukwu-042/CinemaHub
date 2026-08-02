import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiStar, FiShoppingCart, FiHeart, FiPlay, FiClock, FiCalendar, FiGlobe, FiFilm } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/Formatters';
import Badge from '../Badge/Badge';
import Rating from '../Rating/Rating';
import styles from './QuickViewModal.module.css';

const QuickViewModal = ({ movie, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  if (!movie) return null;

  const inWishlist = isInWishlist(movie.id);

  const handleAddToCart = () => {
    addToCart(movie);
  };

  const handleWishlist = () => {
    toggleWishlist(movie);
  };

  const posterSrc = movie.poster || movie.backdrop || movie.image || '/placeholder-poster.svg';

  const handleImageError = (event) => {
    event.currentTarget.src = '/placeholder-poster.svg';
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view for ${movie.title}`}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <FiX />
        </button>

        <div className={styles.grid}>
          {/* Media Section */}
          <div className={styles.media}>
            <img
              style={{objectFit: "contain"}}
              src={posterSrc}
              alt={movie.title}
              className={styles.poster}
              onError={handleImageError}
            />
            <div className={styles.badges}>
              {movie.discount > 0 && <Badge variant="discount">-{movie.discount}% OFF</Badge>}
              {movie.newRelease && <Badge variant="primary">NEW</Badge>}
              {movie.bestseller && <Badge variant="accent">BESTSELLER</Badge>}
            </div>
          </div>

          {/* Details Section */}
          <div className={styles.details}>
            <div className={styles.genres}>
              {movie.genre?.map((g) => (
                <span key={g} className={styles.genreTag}>{g}</span>
              ))}
            </div>

            <h2 className={styles.title}>{movie.title}</h2>

            <div className={styles.ratingRow}>
              <Rating value={movie.rating} showScore size="medium" />
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaItem}><FiCalendar /> {movie.year}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaItem}><FiClock /> {movie.runtime}</span>
              {movie.language && (
                <>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.metaItem}><FiGlobe /> {movie.language}</span>
                </>
              )}
            </div>

            <p className={styles.description}>{movie.description}</p>

            {movie.director && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Director:</span>
                <span className={styles.value}>{movie.director}</span>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Cast:</span>
                <span className={styles.value}>{movie.cast.join(', ')}</span>
              </div>
            )}

            <div className={styles.pricingSection}>
              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>{formatPrice(movie.price)}</span>
                {movie.originalPrice > movie.price && (
                  <span className={styles.originalPrice}>{formatPrice(movie.originalPrice)}</span>
                )}
              </div>
              <span className={styles.availability}>Availability: <strong>{movie.availability || 'In Stock'}</strong></span>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCart} onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button 
                className={`${styles.btnWishlist} ${inWishlist ? styles.wishlisted : ''}`} 
                onClick={handleWishlist}
              >
                <FiHeart /> {inWishlist ? 'Saved' : 'Wishlist'}
              </button>
              <Link to={`/movie/${movie.id}`} className={styles.btnDetails} onClick={onClose}>
                <FiFilm /> View Full Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
