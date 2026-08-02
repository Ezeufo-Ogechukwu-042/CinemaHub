import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import StaffLayout from "./layouts/StaffLayout/StaffLayout";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import AddMovie from "./pages/Admin/AddMovie";

import Loader from "./components/Loader/Loader";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";

// Customer Pages
const Home = lazy(() => import("./pages/Home/Home"));
const Movies = lazy(() => import("./pages/Movies/Movies"));
const MovieDetails = lazy(() => import("./pages/MovieDetails/MovieDetails"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Search = lazy(() => import("./pages/Search/Search"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Authentication
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));

// Admin
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminMovies = lazy(() => import("./pages/Admin/AdminMovies"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/Admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"));

// Staff
const StaffDashboard = lazy(() => import("./pages/Staff/StaffDashboard"));
const StaffOrders = lazy(() => import("./pages/Staff/StaffOrders"));
const StaffSupport = lazy(() => import("./pages/Staff/StaffSupport"));
const StaffInventory = lazy(() => import("./pages/Staff/StaffInventory"));
const StaffMessages = lazy(() => import("./pages/Staff/StaffMessages"));
const StaffSettings = lazy(() => import("./pages/Staff/StaffSettings"));

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "24px",
    }}
  >
    <Loader size="large" text="Preparing your CinemaHub experience..." />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="movies" element={<Movies />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="search" element={<Search />} />

          {/* Protected Customer Pages */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="movies/add" element={<AddMovie />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Staff */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="orders" element={<StaffOrders />} />
          <Route path="support" element={<StaffSupport />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="messages" element={<StaffMessages />} />
          <Route path="settings" element={<StaffSettings />} />
        </Route>

      </Routes>
      <ScrollToTop />
    </Suspense>
  );
};

export default App;