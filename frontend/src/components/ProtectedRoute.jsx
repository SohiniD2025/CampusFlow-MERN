import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, checkingAuth } = useAuth();
  if (checkingAuth) return <div className="center-screen">Checking your session…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
