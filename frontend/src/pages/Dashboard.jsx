import { useEffect, useMemo, useState } from "react";
import { Search, Clock3, CircleCheck, ListTodo, ArrowUpRight, Pencil, Trash2, Check, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AddTaskLink } from "../components/Layout";

function formatDate(date) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tasks", { params: { search, status } });
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadTasks, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    active: tasks.filter((task) => task.status !== "Completed").length
  }), [tasks]);

  async function updateStatus(task) {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const response = await api.put(`/tasks/${task._id}`, { status: next });
      setTasks((current) => current.map((item) => item._id === task._id ? response.data : item));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update task.");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task.");
    }
  }

  return (
    <div className="dashboard">
      <section className="page-heading">
        <div><div className="eyebrow">STUDENT WORKSPACE</div><h1>Your semester, <em>sorted.</em></h1><p className="muted">A clear head starts with a clear plan.</p></div>
        <AddTaskLink />
      </section>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon lavender"><ListTodo size={19} /></div><div><span className="stat-label">Tasks shown</span><strong>{stats.total}</strong></div><span className="stat-note">in this view</span></div>
        <div className="stat-card"><div className="stat-icon peach"><Clock3 size={19} /></div><div><span className="stat-label">To do</span><strong>{stats.active}</strong></div><span className="stat-note">keep moving</span></div>
        <div className="stat-card"><div className="stat-icon mint"><CircleCheck size={19} /></div><div><span className="stat-label">Completed</span><strong>{stats.completed}</strong></div><span className="stat-note">nice work!</span></div>
      </section>

      <section className="task-section">
        <div className="section-heading"><div><h2>Your tasks</h2><p className="muted">Small steps add up.</p></div><span className="task-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span></div>
        <div className="toolbar">
          <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search task or subject…" /></div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select>
        </div>
        {error && <div className="alert error">{error}</div>}
        {loading ? <div className="state-box"><div className="spinner" />Loading your tasks…</div> :
          tasks.length === 0 ? <div className="state-box empty-state"><div className="empty-icon"><CalendarDays size={24} /></div><h3>{search || status !== "All" ? "No matching tasks" : "A fresh start."}</h3><p>{search || status !== "All" ? "Try a different search or status filter." : "Add your first task and make a plan."}</p>{!search && status === "All" && <AddTaskLink />}</div> :
          <div className="task-list">{tasks.map((task) => <article className={`task-row ${task.status === "Completed" ? "is-complete" : ""}`} key={task._id}>
            <button className={`complete-toggle ${task.status === "Completed" ? "checked" : ""}`} onClick={() => updateStatus(task)} title="Toggle completed" aria-label="Toggle completed">{task.status === "Completed" && <Check size={15} />}</button>
            <div className="task-main"><div className="task-title-line"><h3>{task.title}</h3><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div><p className="task-subject">{task.subject || "General"}{task.description ? ` · ${task.description}` : ""}</p><div className="task-meta"><span><CalendarDays size={13} /> {formatDate(task.dueDate)}</span><span className={`status-pill status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span></div></div>
            <div className="task-actions"><Link to={`/tasks/${task._id}/edit`} title="Edit task" aria-label="Edit task"><Pencil size={16} /></Link><button onClick={() => deleteTask(task._id)} title="Delete task" aria-label="Delete task"><Trash2 size={16} /></button></div>
          </article>)}</div>
        }
      </section>
      <div className="tip-banner"><div className="tip-symbol">✳</div><div><strong>One thing at a time.</strong><p>Pick the next small task. You don't need to do everything today.</p></div><ArrowUpRight size={19} className="tip-arrow" /></div>
    </div>
  );
}
