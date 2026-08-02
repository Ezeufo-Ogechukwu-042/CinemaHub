import { createContext, useContext, useEffect, useState } from "react";
import { movieService } from "../services/movieService";

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [
          trendingMovies,
          popularMovies,
          topRatedMovies,
          upcomingMovies,
        ] = await Promise.all([
          movieService.getTrending(),
          movieService.getPopular(),
          movieService.getTopRated(),
          movieService.getUpcoming(),
        ]);

        setTrending(trendingMovies);
        setPopular(popularMovies);
        setTopRated(topRatedMovies);
        setUpcoming(upcomingMovies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        trending,
        popular,
        topRated,
        upcoming,
        loading,
        error,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  return useContext(MovieContext);
}