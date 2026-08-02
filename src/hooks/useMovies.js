import { useEffect, useState } from "react";

export function useMovies(loader) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        const data = await loader();

        if (!ignore) {
          setMovies(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      ignore = true;
    };
  }, [loader]);

  return {
    movies,
    loading,
    error,
  };
}