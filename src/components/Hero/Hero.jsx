import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlay, FiShoppingCart, FiStar, FiClock, FiCalendar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import Badge from '../Badge/Badge';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import styles from './Hero.module.css';

import { useMovieContext } from '../../context/MovieContext';
import Loader from '../Loader/Loader';



const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quickViewMovie, setQuickViewMovie] = useState(null);
  const { addToCart } = useCart();
  const { trending, loading, error } = useMovieContext();

  const heroMovies = trending.slice(0, 5);

  const nextSlide = useCallback(() => {
  if (isAnimating) return;

  setIsAnimating(true);

  setCurrent(prev =>
    heroMovies.length === 0 ? 0 : (prev + 1) % heroMovies.length
  );

  setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, heroMovies.length]);

  

  const prevSlide = useCallback(() => {
  if (isAnimating) return;

  setIsAnimating(true);

  setCurrent(prev =>
    heroMovies.length === 0 ? 0 : (prev - 1) % heroMovies.length
  );

  setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, heroMovies.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);


    if (loading) {
    return (
      <section className={styles.hero}>
        <div className="container">
          <Loader size="large" text="Loading featured movies" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.hero}>
        <div className="container">
          <h2>Failed to load featured movies.</h2>
        </div>
      </section>
    );
  }

  if (heroMovies.length === 0) {
    return null;
  }

  const movie = heroMovies[current];

  return (
    <>
      <section className={styles.hero} aria-label="Featured movies slider">
        {/* Slides backdrop */}
        <div className={styles.slides}>
          {heroMovies.map((m, index) => (
            <div
              key={m.id}
              className={`${styles.slide} ${index === current ? styles.active : ''}`}
              aria-hidden={index !== current}
            >
              <div className={styles.backdropContainer}>
                <img 
                  src={m.backdrop} 
                  alt={m.title} 
                  loading={index === 0 ? 'eager' : 'lazy'} 
                  className={styles.backdropImg}
                />
                <div className={styles.gradientOverlay} />
                <div className={styles.sideVignette} />
              </div>
            </div>
          ))}
        </div>

        {/* Content Details */}
        <div className={`container ${styles.contentWrapper}`}>
          <div className={styles.infoBox} key={movie.id}>
            <div className={styles.badgesRow}>
              {/*<Badge variant="primary">★ NEW RELEASE</Badge>*/}
              {/*<Badge variant="accent">🔥 BESTSELLER</Badge>*/}
              {movie.genre && (
                <span className={styles.genrePill}>{movie.genre[0]}</span>
              )}
            </div>

            <h5 className={styles.title}>{movie.title}</h5>

            <div className={styles.metaRow}>
              <div className={styles.ratingBadge}>
                <FiStar className={styles.starIcon} />
                <span>{movie.rating}</span>
              </div>
              <span className={styles.metaText}><FiCalendar /> {movie.year}</span>
              {/*<span className={styles.metaText}><FiClock /> {}</span>*/}
              {/*<span className={styles.pricePill}>{}</span>*/}
            </div>

            <p className={styles.description}>{movie.description}</p>

            <div className={styles.actionsRow}>
              <Link to={`/movie/${movie.id}`} className={styles.btnPrimary}>
                <div className={styles.playIconBg}>
                  <FiPlay />
                </div>
                <span>Watch Details</span>
              </Link>
              
              <button 
                className={styles.btnSecondary}
                onClick={() => addToCart(movie)}
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button 
                className={styles.btnOutline}
                onClick={() => setQuickViewMovie(movie)}
                title="Quick View"
              >
                <FiEye /> Quick Preview
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={prevSlide} aria-label="Previous slide">
          <FiChevronLeft />
        </button>
        <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={nextSlide} aria-label="Next slide">
          <FiChevronRight />
        </button>

        {/* Slide Indicators & Thumbnails */}
        <div className={styles.dotsBar}>
          {heroMovies.map((m, index) => (
            <button
              key={m.id}
              className={`${styles.dotItem} ${index === current ? styles.activeDot : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={styles.dotTitle}>{m.title}</span>
              <div className={styles.progressBar} />
            </button>
          ))}
        </div>
      </section>

      {quickViewMovie && (
        <QuickViewModal movie={quickViewMovie} onClose={() => setQuickViewMovie(null)} />
      )}
    </>
  );
};

export default Hero;