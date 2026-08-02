import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiFilm,
  FiTrendingUp,
  FiTrendingDown,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiDownload,
} from "react-icons/fi";

import styles from "./AdminDashboard.module.css";

import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import { formatPrice } from "../../utils/formatters";
import { adminService } from "../../services/adminService";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [movieFilter, setMovieFilter] = useState("all");

  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    movies: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboard = await adminService.getDashboard();

      setMovies(dashboard.movies || []);
      setUsers(dashboard.users || []);
      setOrders(dashboard.orders || []);

      setStats({
        revenue: dashboard.totalRevenue || 0,
        users: dashboard.totalUsers || 0,
        orders: dashboard.totalOrders || 0,
        movies: dashboard.totalMovies || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = movies
    .filter((movie) => {
      if (movieFilter === "active") return movie.available === true;
      if (movieFilter === "hidden") return movie.available === false;
      return true;
    })
    .filter((movie) =>
      movie.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  function getStatusBadge(status) {
    const variants = {
      completed: "success",
      processing: "warning",
      pending: "primary",
      cancelled: "discount",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading dashboard" />
      </div>
    );
  }

return (
  <div className={styles.dashboard}>

    {/* ================= HEADER ================= */}

    <div className={styles.header}>

      <div>
        <h1>Admin Dashboard</h1>

        <p className={styles.subtitle}>
          Welcome back! Here's an overview of your CinemaHub platform.
        </p>
      </div>

      <div className={styles.headerActions}>

        <Button variant="secondary" size="small">
          <FiDownload />
          Export
        </Button>

        <Link to="/admin/movies/add">
          <Button variant="primary" size="small">
              <FiPlus />
              Add Movie
          </Button>
      </Link>

      </div>

    </div>

    {/* ================= STATISTICS ================= */}

    <div className={styles.statsGrid}>

      <div className={styles.statCard}>

        <div className={styles.statHeader}>

          <div className={`${styles.statIcon} ${styles.icon0}`}>
            <FiDollarSign />
          </div>

          <span className={`${styles.statChange} ${styles.up}`}>
            <FiTrendingUp />
            Revenue
          </span>

        </div>

        <h2 className={styles.statValue}>
          {formatPrice(stats.revenue)}
        </h2>

        <p className={styles.statLabel}>
          Total Revenue
        </p>

      </div>

      <div className={styles.statCard}>

        <div className={styles.statHeader}>

          <div className={`${styles.statIcon} ${styles.icon1}`}>
            <FiUsers />
          </div>

          <span className={`${styles.statChange} ${styles.up}`}>
            <FiTrendingUp />
            Users
          </span>

        </div>

        <h2 className={styles.statValue}>
          {stats.users}
        </h2>

        <p className={styles.statLabel}>
          Registered Users
        </p>

      </div>

      <div className={styles.statCard}>

        <div className={styles.statHeader}>

          <div className={`${styles.statIcon} ${styles.icon2}`}>
            <FiShoppingBag />
          </div>

          <span className={`${styles.statChange} ${styles.up}`}>
            <FiTrendingUp />
            Orders
          </span>

        </div>

        <h2 className={styles.statValue}>
          {stats.orders}
        </h2>

        <p className={styles.statLabel}>
          Orders Completed
        </p>

      </div>

      <div className={styles.statCard}>

        <div className={styles.statHeader}>

          <div className={`${styles.statIcon} ${styles.icon3}`}>
            <FiFilm />
          </div>

          <span className={`${styles.statChange} ${styles.up}`}>
            <FiTrendingUp />
            Movies
          </span>

        </div>

        <h2 className={styles.statValue}>
          {stats.movies}
        </h2>

        <p className={styles.statLabel}>
          Movies Listed
        </p>

      </div>

    </div>

        {/* ================= CHARTS ================= */}

    <div className={styles.chartsRow}>

      {/* Revenue Chart */}

      <div className={styles.chartCard}>

        <div className={styles.chartHeader}>
          <h3>Revenue Overview</h3>

          <select className={styles.chartSelect}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>

        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.barChart}>

            {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (

              <div
                key={index}
                className={styles.barWrapper}
              >

                <div
                  className={styles.bar}
                  style={{
                    height: `${height}%`,
                  }}
                />

                <span>
                  {
                    [
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                      "Sun",
                    ][index]
                  }
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Latest Movies */}

      <div className={styles.chartCard}>

        <div className={styles.chartHeader}>
          <h3>Latest Movies</h3>
        </div>

        <div className={styles.topMovies}>

          {movies.length === 0 ? (

            <div className={styles.emptyState}>
              No movies found.
            </div>

          ) : (

            movies.slice(0, 5).map((movie, index) => (

              <div
                key={movie.id}
                className={styles.topMovie}
              >

                <span className={styles.rank}>
                  #{index + 1}
                </span>

                <div className={styles.topMovieInfo}>

                  <span className={styles.topMovieTitle}>
                    {movie.title}
                  </span>

                  <span className={styles.topMovieMeta}>
                    {movie.genre || "No Genre"}
                  </span>

                </div>

                <div className={styles.topMovieRight}>

                  <span className={styles.topMovieRevenue}>
                    {formatPrice(movie.price)}
                  </span>

                  <span className={styles.topMovieTrend}>
                    ⭐ {movie.rating ?? "N/A"}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

        {/* ================= TABLES ================= */}

    <div className={styles.tablesRow}>

      {/* ================= RECENT ORDERS ================= */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>

          <h3>Recent Orders</h3>

          <Link
            to="/admin/orders"
            className={styles.viewAll}
          >
            View All
          </Link>

        </div>

        <div className={styles.tableWrapper}>

          {orders.length === 0 ? (

            <div className={styles.emptyState}>
              No orders found.
            </div>

          ) : (

            <table className={styles.table}>

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {orders.slice(0, 5).map((order) => (

                  <tr key={order.id}>

                    <td className={styles.mono}>
                      {order.id.slice(0, 8)}
                    </td>

                    <td>
                      {order.customer_name || "Unknown"}
                    </td>

                    <td>
                      {order.movie_title || "Movie"}
                    </td>

                    <td className={styles.price}>
                      {formatPrice(order.amount || 0)}
                    </td>

                    <td>
                      {getStatusBadge(order.status)}
                    </td>

                    <td className={styles.muted}>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* ================= USERS ================= */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>

          <h3>Latest Users</h3>

          <Link
            to="/admin/users"
            className={styles.viewAll}
          >
            View All
          </Link>

        </div>

        <div className={styles.tableWrapper}>

          {users.length === 0 ? (

            <div className={styles.emptyState}>
              No users found.
            </div>

          ) : (

            <table className={styles.table}>

              <thead>

                <tr>
                  <th>User</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {users.slice(0, 5).map((user) => (

                  <tr key={user.id}>

                    <td>

                      <div className={styles.userCell}>

                        <div className={styles.userAvatar}>

                          {(user.full_name || user.email)
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <div className={styles.userName}>
                            {user.full_name || "Unnamed User"}
                          </div>

                          <div className={styles.userEmail}>
                            {user.email}
                          </div>

                        </div>

                      </div>

                    </td>

                    <td className={styles.muted}>
                      {new Date(
                        user.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "primary"
                            : "outline"
                        }
                      >
                        {user.role || "user"}
                      </Badge>
                    </td>

                    <td>

                      <Badge variant="success">
                        Active
                      </Badge>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>

        {/* ================= MOVIE INVENTORY ================= */}

    <div className={styles.tableCard}>

      <div className={styles.tableHeader}>

        <h3>Movie Inventory</h3>

        <div className={styles.tableActions}>

          <div className={styles.searchBox}>

            <FiSearch />

            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <select
            className={styles.filterSelect}
            value={movieFilter}
            onChange={(e) =>
              setMovieFilter(e.target.value)
            }
          >
            <option value="all">
              All Movies
            </option>

            <option value="active">
              Available
            </option>

            <option value="hidden">
              Hidden
            </option>

          </select>

          <Link to="/admin/movies/new">

            <Button
              variant="primary"
              size="small"
            >
              <FiPlus />
              Add Movie
            </Button>

          </Link>

        </div>

      </div>

      <div className={styles.tableWrapper}>

        {filteredMovies.length === 0 ? (

          <div className={styles.emptyState}>

            <FiFilm
              className={styles.emptyIcon}
            />

            <h3>No Movies Found</h3>

            <p>
              Try another search or add a new
              movie.
            </p>

          </div>

        ) : (

          <table className={styles.table}>

            <thead>

              <tr>

                <th>Movie</th>

                <th>Genre</th>

                <th>Price</th>

                <th>Rating</th>

                <th>Status</th>

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

                        <div
                          className={
                            styles.movieTitle
                          }
                        >
                          {movie.title}
                        </div>

                        <div
                          className={
                            styles.movieYear
                          }
                        >
                          {movie.release_date
                            ?.slice(0, 4) ||
                            "----"}
                        </div>

                      </div>

                    </div>

                  </td>

                  <td>
                    {movie.genre ||
                      "Uncategorized"}
                  </td>

                  <td
                    className={styles.price}
                  >
                    {formatPrice(movie.price)}
                  </td>

                  <td>
                    ⭐ {movie.rating}
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
                        : "Hidden"}
                    </Badge>

                  </td>

                  <td>

                    <div
                      className={
                        styles.rowActions
                      }
                    >

                      <Link
                        to={`/admin/movies/edit/${movie.id}`}
                      >

                        <button
                          className={
                            styles.actionIcon
                          }
                        >
                          <FiEdit2 />
                        </button>

                      </Link>

                      <button
                        className={
                          styles.actionIcon
                        }
                        onClick={() =>
                          adminService.deleteMovie(
                            movie.id
                          )
                        }
                      >
                        <FiTrash2 />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  </div>
);

};

export default AdminDashboard;