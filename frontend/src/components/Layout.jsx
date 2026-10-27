import { BookOpen, LogOut, Plus } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try { await logout(); } finally { navigate("/login"); }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/"><span className="brand-mark"><BookOpen size={19} /></span> CampusFlow</Link>
        <div className="topbar-right">
          <span className="welcome">Hi, {user?.name?.split(" ")[0]}</span>
          <button className="icon-button" onClick={handleLogout} title="Log out" aria-label="Log out"><LogOut size={18} /></button>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="footer">A calmer way to manage college life.</footer>
    </div>
  );
}

export function AddTaskLink() {
  return <Link className="button primary" to="/tasks/new"><Plus size={17} /> Add task</Link>;
}
