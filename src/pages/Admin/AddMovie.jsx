import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { searchMovies } from "../../api/tmdb";
import { adminService } from "../../services/adminService";
import Button from "../../components/Button/Button";
import styles from "./AddMovie.module.css";

const AddMovie = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(null);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const movies = await searchMovies(query);

      setResults(movies);

    } catch (err) {
      console.error(err);
      alert("Unable to search TMDB.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(movie) {
    try {
      setImporting(movie.id);

      await adminService.importMovie(movie);

      alert(`${movie.title} imported successfully!`);

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setImporting(null);

    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Add Movie</h1>
          <p>Search TMDB and import movies into CinemaHub.</p>
        </div>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button onClick={handleSearch}>
          <FiSearch />
          Search
        </Button>
      </div>

      {loading && (
        <div className={styles.loading}>
          Searching movies...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className={styles.empty}>
          <h3>No Movies Found</h3>
          <p>Search TMDB to begin importing movies.</p>
        </div>
      )}

      <div className={styles.moviesGrid}>
        {results.map((movie) => (
          <div
            key={movie.id}
            className={styles.movieCard}
          >
            <img
              className={styles.poster}
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.png"
              }
              alt={movie.title}
            />

            <div className={styles.info}>
              <h3>{movie.title}</h3>

              <p>
                {movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : "N/A"}
              </p>

              <p>
                ⭐ {movie.vote_average.toFixed(1)}
              </p>

              <button
                className={styles.importButton}
                disabled={importing === movie.id}
                onClick={() => handleImport(movie)}
              >
                {importing === movie.id
                  ? "Importing..."
                  : "Import Movie"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddMovie;