import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect. Check that the backend is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Link className="brand light-brand" to="/login"><span className="brand-mark"><BookOpen size={19} /></span> CampusFlow</Link>
        <div className="aside-copy">
          <div className="eyebrow">YOUR SEMESTER, IN CONTROL</div>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p>Keep assignments, deadlines, and study plans in one calm little place.</p>
          <div className="mini-stat"><span className="stat-dot" /> A little progress, every day.</div>
        </div>
        <div className="aside-decoration">CF.</div>
      </div>
      <div className="auth-main">
        <div className="auth-form-wrap">
          <div className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</div>
          <h2>{isRegister ? "Create your account" : "Good to see you again."}</h2>
          <p className="muted">{isRegister ? "Set up your space and start planning." : "Sign in to pick up where you left off."}</p>
          <form onSubmit={submit} className="form-stack">
            {isRegister && <label>Full name<input name="name" value={form.name} onChange={update} placeholder="e.g. Aanya Sharma" required maxLength="60" /></label>}
            <label>Email address<input type="email" name="email" value={form.email} onChange={update} placeholder="you@college.edu" required /></label>
            <label>Password<input type="password" name="password" value={form.password} onChange={update} placeholder="At least 6 characters" required minLength="6" /></label>
            {error && <div className="alert error">{error}</div>}
            <button className="button primary full" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{isRegister ? "Already have an account?" : "New to CampusFlow?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
        </div>
      </div>
    </div>
  );
}
