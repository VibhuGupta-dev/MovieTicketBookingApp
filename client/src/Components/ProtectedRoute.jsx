// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  // Not logged in at all
  if (!token) return <Navigate to="/" replace />;

  // Decode the token to get the role (if JWT)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
  
    if (allowedRole && payload.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }
  } catch {
    // Invalid token
    return <Navigate to="/" replace />;
  }

  return children;
}