import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader/Loader";

const getUserRole = (user) => {
  if (!user) return "user";

  const rawRole = user.app_metadata?.role || user.user_metadata?.role || user.role || "user";
  return String(rawRole).toLowerCase();
};

const ProtectedRoute = ({ children, requiredRole, allowedRoles = [] }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <Loader size="large" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole(user);
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