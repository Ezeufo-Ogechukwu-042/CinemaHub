import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../Context/WishlistContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import MovieCard from '../../components/MovieCard/MovieCard';
import Button from '../../components/Button/Button';
import styles from './Wishlist.module.css';
import { useMovieContext } from "../../Context/MovieContext";



const Wishlist = () => {
  const { wishlist } = useWishlist();
  const {
      trending,
      popular,
      topRated,
      upcoming,
      loading,
      error,
    } = useMovieContext(); 

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <EmptyState
          icon="wishlist"
          title="Your wishlist is empty"
          description="Save your favorite movies to purchase later."
          action={<Link to="/movies"><Button>Browse Movies</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My Wishlist <span>({wishlist.length})</span></h1>
        <div className={styles.grid}>
          {wishlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;