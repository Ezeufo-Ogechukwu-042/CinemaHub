import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  // Wait for Supabase to check if the user is logged in
  if (loading) {
    return <Loader size="large" />;
  }

  // If the user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;