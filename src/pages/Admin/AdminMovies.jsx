import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { formatPrice } from "../../utils/formatters";
import { Link } from "react-router-dom";

import { adminService } from "../../services/adminService";

import styles from "./AdminDashboard.module.css";

const AdminMovies = () => {
  const [loading, setLoading] = useState(true);

  const [movies, setMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoading(true);

      const data = await adminService.getMovies();

      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading movies" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Manage Movies</h1>

          <p className={styles.subtitle}>
            Add, edit or remove movies from your catalogue.
          </p>
        </div>

        <Link to="/admin/movies/add">
          <Button variant="secondary" size="medium">
              <FiPlus />
              Add Movie
          </Button>
      </Link>
      </div>

      {/* Table */}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>All Movies ({filteredMovies.length})</h3>

          <div className={styles.searchBox}>
            <FiSearch />

            <input
              type="text"
              placeholder="Search movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <div className={styles.movieCell}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className={styles.movieThumb}
                      />

                      <div>
                        <div className={styles.movieTitle}>
                          {movie.title}
                        </div>

                        <div className={styles.movieYear}>
                          {movie.year}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {Array.isArray(movie.genre)
                      ? movie.genre.join(", ")
                      : movie.genre}
                  </td>

                  <td className={styles.price}>
                    {formatPrice(movie.price)}
                  </td>

                  <td>
                    <Badge
                      variant={
                        movie.available
                          ? "success"
                          : "warning"
                      }
                    >
                      {movie.available
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  </td>

                  <td>{movie.rating}</td>

                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.actionIcon}>
                        <FiEdit2 />
                      </button>

                      <button className={styles.actionIcon}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMovies.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className={styles.emptyState}>
                      No movies found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMovies;