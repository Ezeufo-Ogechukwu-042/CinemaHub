import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiHeart, FiShoppingCart, FiShare2, FiPlay, FiStar, 
  FiClock, FiGlobe, FiCalendar, FiUser, FiCheck, FiX, FiFilm, FiSend 
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';
import { recordRateLimitAttempt } from '../../utils/rateLimit';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Rating from '../../components/Rating/Rating';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import MovieCard from '../../components/MovieCard/MovieCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import styles from './MovieDetails.module.css';

import { useMovieContext } from '../../context/MovieContext';
import { movieService } from "../../services/movieService";
import Loader from '../../components/Loader/Loader';


const MovieDetails = () => {
  const { id } = useParams();
  const {
  trending,
  popular,
  topRated,
  upcoming,
  loading,
  error,
} = useMovieContext();

const movies = [
  ...trending,
  ...popular,
  ...topRated,
  ...upcoming,
].filter(
  (movie, index, self) =>
    index === self.findIndex((m) => m.id === movie.id)
);

const movie = movies.find(
  (m) => m.id === Number(id)
);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTrailer, setShowTrailer] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movieReviews, setMovieReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: '5' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    useEffect(() => {async function loadTrailer() {
    try {
      const videos = await movieService.getVideos(id);

      const officialTrailer =
    videos.results.find(
        (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
    ) ||
    videos.results.find(
        (video) => video.site === "YouTube"
    );

      setTrailer(officialTrailer);
    } catch (err) {
      console.log(err);
    }
  }

  if (id) {
    loadTrailer();
  }
}, [id]);

  if (loading) {
  return <Loader size="large" text="Loading movie details" />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '16px' }}>Movie not found</h1>
        <Link to="/movies" style={{ color: 'var(--primary)', fontWeight: 700 }}>Return to Movies Catalog</Link>
      </div>
    );
  }


  const relatedMovies = movies
  .filter((m) => {
    if (m.id === movie.id) return false;

    return m.genre?.some((g) =>
      movie.genre?.includes(g)
    );
  })
  .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const name = reviewForm.name.trim();
    const text = reviewForm.text.trim();

    if (!name || !text) {
      setReviewMessage('Please add your name and a short review before posting.');
      return;
    }

    const reviewIdentifier = `${movie.id}:${name.toLowerCase()}`;
    const rateLimitCheck = recordRateLimitAttempt('review', reviewIdentifier);

    if (!rateLimitCheck.allowed) {
      setReviewMessage(rateLimitCheck.message);
      return;
    }

    setIsReviewSubmitting(true);
    const newReview = {
      id: Date.now(),
      author: name,
      rating: Number(reviewForm.rating),
      comment: text,
      date: 'Just now',
    };

    setMovieReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: '', text: '', rating: '5' });
    setReviewMessage('Thanks for sharing your feedback.');
    setTimeout(() => setIsReviewSubmitting(false), 400);
  };

  return (
    <div className={styles.page}>
      {/* Hero Backdrop Banner */}
      <div className={styles.banner}>
        <img src={movie.backdrop} alt="" className={styles.backdrop} />
        <div className={styles.gradient} />
        <button className={styles.playTrailerBannerBtn} onClick={() => setShowTrailer(true)}>
          <div className={styles.playPulse}>
            <FiPlay />
          </div>
          <span>Watch Official Trailer</span>
        </button>
      </div>

      <div className="container">
        <div className={styles.content}>
          <Breadcrumb items={[
            { label: 'Movies', path: '/movies' },
            { label: movie.title }
          ]} />

          <div className={styles.layout}>
            {/* Poster Card */}
            <div className={styles.posterCard}>
              <img src={movie.poster} alt={`${movie.title} poster`} className={styles.posterImg} />
              <div className={styles.availabilityPill}>
                <FiCheck style={{ color: 'var(--success)' }} />
                <span>Available in Ultra HD 4K</span>
              </div>
            </div>

            {/* Main Information Panel */}
            <div className={styles.info}>
              <div className={styles.badges}>
                {movie.newRelease && <Badge variant="primary">★ NEW RELEASE</Badge>}
                {movie.bestseller && <Badge variant="accent">🔥 BESTSELLER</Badge>}
                {movie.discount > 0 && <Badge variant="discount">-{movie.discount}% SPECIAL OFFER</Badge>}
              </div>

              <h1 className={styles.title}>{movie.title}</h1>
              
              <div className={styles.metaRow}>
                <div className={styles.ratingBadge}>
                  <FiStar className={styles.starIcon} />
                  <span>{movie.rating}</span>
                </div>
                <span className={styles.metaItem}><FiCalendar /> {movie.year}</span>
                <span className={styles.metaItem}><FiClock /> {movie.duration || "N/A"}</span>
                <span className={styles.metaItem}><FiGlobe /> {movie.originalLanguage}</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(movie.price)}</span>
                {movie.originalPrice > movie.price && (
                  <span className={styles.originalPrice}>{formatPrice(movie.originalPrice)}</span>
                )}
                {movie.discount > 0 && (
                  <Badge variant="success">Save {formatPrice(movie.originalPrice - movie.price)}</Badge>
                )}
              </div>

              <p className={styles.description}>{movie.description}</p>

              <div className={styles.actions}>
                <button className={styles.btnPrimary} onClick={() => addToCart(movie)}>
                  <FiShoppingCart /> Add to Cart
                </button>
                <button 
                  className={`${styles.btnSecondary} ${isInWishlist(movie.id) ? styles.wishlisted : ''}`}
                  onClick={() => toggleWishlist(movie)}
                >
                  <FiHeart /> {isInWishlist(movie.id) ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>
                <button className={styles.btnGhost} onClick={handleShare}>
                  <FiShare2 /> {copiedShare ? 'Link Copied!' : 'Share'}
                </button>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Director</span>
                  <span className={styles.detailValue}>Unknown</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Genres</span>
                  <span className={styles.detailValue}>
                    {movie.genre?.join(", ")}
                  </span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Country</span>
                  <span className={styles.detailValue}>
                    {movie.originalLanguage?.toUpperCase()}
                  </span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Availability</span>
                  <span className={styles.detailValue}>{movie.availability || 'In Stock'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabsNav}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Story Overview
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'cast' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast & Crew
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Audience Reviews ({movieReviews.length})
            </button>
          </div>

          <div className={styles.tabPanel}>
            {activeTab === 'overview' && (
              <div className={styles.overviewBox}>
                <h3>Synopsis & Features</h3>
                <p>{movie.description}</p>
                <div className={styles.trailerBox}>
                  <button className={styles.trailerPlayBtn} onClick={() => setShowTrailer(true)}>
                    <FiPlay /> Watch Trailer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className={styles.castGrid}>
                {movie.cast?.length ? (movie.cast.map((actor, i) => (
                  <div key={i} className={styles.castMember}>
                    <div className={styles.castAvatar}>
                      <FiUser />
                    </div>
                    <div>
                      <span className={styles.actorName}>{actor}</span>
                      <span className={styles.actorRole}>Lead Cast</span>
                    </div>
                  </div>
                  ))
                ) : (
                  <p>No cast available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                <form className={styles.reviewComposer} onSubmit={handleReviewSubmit}>
                  <h3>Share your thoughts</h3>
                  <p className={styles.reviewHint}>Reviews are limited to keep the experience fair and helpful.</p>
                  {reviewMessage && <p className={styles.reviewMessage}>{reviewMessage}</p>}
                  <div className={styles.reviewGrid}>
                    <input
                      className={styles.reviewInput}
                      placeholder="Your name"
                      value={reviewForm.name}
                      onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })}
                    />
                    <select
                      className={styles.reviewSelect}
                      value={reviewForm.rating}
                      onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}
                    >
                      <option value="5">5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                      <option value="2">2 stars</option>
                      <option value="1">1 star</option>
                    </select>
                  </div>
                  <textarea
                    className={styles.reviewTextarea}
                    rows={4}
                    placeholder="What stood out to you about this movie?"
                    value={reviewForm.text}
                    onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })}
                  />
                  <Button type="submit" variant="primary" loading={isReviewSubmitting}>
                    <FiSend /> Post Review
                  </Button>
                </form>

                {movieReviews.length > 0 ? (
                  movieReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className={styles.noReviews}>
                    <p>No audience reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Recommendations */}
          {relatedMovies.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <div className={styles.relatedGrid}>
                {relatedMovies.map(m => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Video Player Overlay Modal */}
      {showTrailer && (
        <div className={styles.trailerOverlay} onClick={() => setShowTrailer(false)}>
          <div className={styles.trailerContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeTrailerBtn} onClick={() => setShowTrailer(false)}>
              <FiX />
            </button>
            {trailer ? (
              <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={movie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              />
          ) : (
              <h2>No trailer available.</h2>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;