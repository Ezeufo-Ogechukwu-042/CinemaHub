import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader/Loader";

const getUserRole = (profile) => {
  if (!profile?.role) {
    return "user";
  }

  return String(profile.role).toLowerCase();
};

const ProtectedRoute = ({ children, requiredRole, allowedRoles = [] }) => {
  const { user, profile, loading } = useUser();

  if (loading) {
    return <Loader size="large" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  const role = getUserRole(profile);
  const hasRequiredRole = !requiredRole && allowedRoles.length === 0
    ? true
    : allowedRoles.length > 0
      ? allowedRoles.includes(role)
      : role === requiredRole;

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;