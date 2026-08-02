import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiZap, FiAward, FiArrowRight } from 'react-icons/fi';
import Hero from '../../components/Hero/Hero';
import Carousel from '../../components/Carousel/Carousel';
import MovieCard from '../../components/MovieCard/MovieCard';
import Banner from '../../components/Banner/Banner';
import NewsLetter from '../../components/NewsLetter/NewsLetter';
import styles from './Home.module.css';
import { useMovieContext } from '../../Context/MovieContext';
import Loader from '../../components/Loader/Loader';





const Home = () => {
  const {
    trending,
    popular,
      topRated,
      upcoming,
      loading,
      error
  } = useMovieContext();
  const sections = [
      {
          key: "trending",
          title: "Trending",
          movies: trending,
          icon: FiTrendingUp
      },
      {
          key: "popular",
          title: "Popular Movies",
          movies: popular,
          icon: FiStar
      },
      {
          key: "topRated",
          title: "Top Rated",
          movies: topRated,
          icon: FiAward
      },
      {
          key: "upcoming",
          title: "Coming Soon",
          movies: upcoming,
          icon: FiZap
      }
  ];
  if (loading) {
    return <Loader size="large" text="Loading featured movies" />;
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <div className={styles.home}>
      <Hero />
      
      <div className={styles.sectionsContainer}>
        {sections.map(section => {
          const sectionMovies = section.movies;

          if (sectionMovies.length === 0) return null;
          
          return (
            <Carousel 
              key={section.key}
              title={
                <span className={styles.sectionTitle}>
                  <section.icon className={styles.sectionIcon} />
                  {section.title}
                </span>
              }
              action={
                <Link to={`/movies?filter=${section.key}`} className={styles.viewAllBtn}>
                  <span>Explore All</span>
                  <FiArrowRight />
                </Link>
              }
            >
              {sectionMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </Carousel>
          );
        })}
      </div>

      <Banner />
      <NewsLetter />
    </div>
  );
};

export default Home;