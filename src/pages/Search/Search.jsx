import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import MovieCard from '../../components/MovieCard/MovieCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './Search.module.css';
import { useMovieContext } from "../../Context/MovieContext";
import Loader from '../../components/Loader/Loader';


const Search = () => {
  const [searchParams] = useSearchParams();
  const {
  trending,
  popular,
  topRated,
  upcoming,
  loading,
  error,
 } = useMovieContext();
  const query = searchParams.get('q') || '';

 const movies = [
  ...trending,
  ...popular,
  ...topRated,
  ...upcoming,
  ].filter(
    (movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
  );

  const results = useMemo(() => {
  if (!query) return [];

  const lower = query.toLowerCase();

  return movies.filter((movie) => {
    const title =
      movie.title?.toLowerCase() || "";

    const genres =
      movie.genre?.join(" ").toLowerCase() || "";

    const overview =
      movie.description?.toLowerCase() || "";

    return (
      title.includes(lower) ||
      genres.includes(lower) ||
      overview.includes(lower)
    );
  });
}, [movies, query]);

    if (loading) {
    return <Loader size="large" text="Searching movies" />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
   <div className={styles.page}>
  <div className={styles.container}>

    <div className={styles.header}>

      <h1 className={styles.title}>
        <FiSearch />
        Search Results
      </h1>

      <p className={styles.query}>
        Results for "<strong>{query}</strong>"
      </p>

      <p className={styles.resultsCount}>
        {results.length} movie{results.length !== 1 && "s"} found
      </p>

    </div>

    {results.length > 0 ? (

      <div className={styles.grid}>

        {results.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}

      </div>

    ) : (

      <EmptyState
        icon="search"
        title="No results found"
        description={`We couldn't find anything matching "${query}".`}
      />

    )}

  </div>
</div>
  );
};

export default Search;


