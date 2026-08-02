import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiCheck, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import MovieCard from '../../components/MovieCard/MovieCard';
import GenreBadge from '../../components/GenreBadge/GenreBadge';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useIntersectionObserver } from '../../hooks/UseIntersectionObserver';
import styles from './Movies.module.css';
import { useMovieContext } from "../../Context/MovieContext";
import Loader from '../../components/Loader/Loader';

const sortOptions = [
  { value: 'newest', label: 'Newest Releases' },
  { value: 'oldest', label: 'Classic Era' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Movies = () => {
  const [searchParams] = useSearchParams();
  const {
    trending,
    popular,
    topRated,
    upcoming,
    loading,
    error,
  } = useMovieContext(); 
  const genres = [];
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [ref, isVisible] = useIntersectionObserver();

  const filterParam = searchParams.get('filter');


  const filteredMovies = useMemo(() => {

    let result = [];

    switch (filterParam) {

        case "trending":
            result = [...trending];
            break;

        case "popular":
            result = [...popular];
            break;

        case "topRated":
            result = [...topRated];
            break;

        case "upcoming":
            result = [...upcoming];
            break;

        default:
            result = [
                ...trending,
                ...popular,
                ...topRated,
                ...upcoming,
            ];
    }

    // Remove duplicate movies
    result = result.filter(
        (movie, index, self) =>
            index === self.findIndex(m => m.id === movie.id)
    );

    // Sort

    switch (sortBy) {

        case "rating":
            result.sort((a, b) => b.rating - a.rating);
            break;

        case "popular":
            result.sort((a, b) => b.popularity - a.popularity);
            break;

        case "newest":
            result.sort((a, b) => Number(b.year) - Number(a.year));
            break;

        case "oldest":
            result.sort((a, b) => Number(a.year) - Number(b.year));
            break;

        default:
            break;
    }

    return result;

  }, [
      trending,
      popular,
      topRated,
      upcoming,
      filterParam,
      sortBy,
  ]);
 

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setPriceRange([0, 50]);
    setSortBy('newest');
  };

  if (loading) {
      return <Loader size="large" text="Loading movies" />;
  }

  if (error) {
      return <h2>{error}</h2>;
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Movies Catalog' }]} />
        
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {filterParam === "trending"
                ? "🔥 Trending Movies"
                : filterParam === "popular"
                ? "⭐ Popular Movies"
                : filterParam === "topRated"
                ? "🏆 Top Rated Movies"
                : filterParam === "upcoming"
                ? "🎬 Coming Soon"
                : "Explore All Movies"}
            </h1>
            <p className={styles.subtitle}>Browse our curated selection of digital cinema in 4K Ultra HD.</p>
          </div>

          <div className={styles.headerActions}>
            <button 
              className={styles.filterToggleBtn}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </button>
          </div>
        </div>

        {/* Selected Filter Chips Bar */}
        {selectedGenres.length > 0 && (
          <div className={styles.activeChipsBar}>
            <span className={styles.chipsLabel}>Active Filters:</span>
            {selectedGenres.map(g => (
              <span key={g} className={styles.chipPill} onClick={() => toggleGenre(g)}>
                {g} <FiX />
              </span>
            ))}
            <button className={styles.resetChipsBtn} onClick={resetFilters}>
              Clear All
            </button>
          </div>
        )}

        <div className={styles.layout}>
          {/* Sidebar Filter Panel */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3>Refine Search</h3>
              <button onClick={() => setShowFilters(false)} className={styles.closeBtn} aria-label="Close filters">
                <FiX />
              </button>
            </div>

            <div className={styles.filterGroup}>
              <h4>Sort Collection</h4>
              <select 
                className={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h4>Genres</h4>
              <p style={{ color: "#999", fontSize: "14px" }}>
                Genre filtering coming soon...
              </p>
            </div>

            <div className={styles.filterGroup}>
              <h4>Price Range ($)</h4>
              <div className={styles.priceInputs}>
                <input 
                  type="number" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className={styles.priceInput}
                  placeholder="Min"
                  min="0"
                />
                <span className={styles.priceDash}>-</span>
                <input 
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className={styles.priceInput}
                  placeholder="Max"
                  max="100"
                />
              </div>
            </div>

            <button 
              className={styles.clearBtn}
              onClick={resetFilters}
            >
              <FiRefreshCw /> Reset All Filters
            </button>
          </aside>

          {/* Main Grid View */}
          <div className={styles.content} ref={ref}>
            <div className={styles.topMetaBar}>
              <span className={styles.countBadge}>
                Showing <strong>{filteredMovies.length}</strong> movies
              </span>
            </div>

            <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : ''}`}>
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🎬</div>
                <h3>No movies match your filters</h3>
                <p>Try resetting active genre selections or price range.</p>
                <button className={styles.resetFiltersBtn} onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;