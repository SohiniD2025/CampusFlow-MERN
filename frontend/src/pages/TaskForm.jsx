import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const initialForm = { title: "", subject: "", description: "", dueDate: "", priority: "Medium", status: "Pending" };

export default function TaskForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    api.get(`/tasks/${id}`)
      .then(({ data }) => setForm({
        title: data.title || "", subject: data.subject || "", description: data.description || "",
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 10) : "",
        priority: data.priority || "Medium", status: data.status || "Pending"
      }))
      .catch((err) => setError(err.response?.data?.message || "Could not load this task."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, dueDate: form.dueDate || null };
    try {
      if (editing) await api.put(`/tasks/${id}`, payload);
      else await api.post("/tasks", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="state-box"><div className="spinner" />Loading task…</div>;

  return <div className="task-form-page">
    <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to tasks</Link>
    <div className="form-card">
      <div className="eyebrow">{editing ? "MAKE AN UPDATE" : "MAKE A PLAN"}</div>
      <h1>{editing ? "Edit your task" : "Add a new task"}</h1>
      <p className="muted">{editing ? "Plans change. Keep your list up to date." : "Get it out of your head and onto your list."}</p>
      <form className="form-stack task-fields" onSubmit={submit}>
        <label>Task title *<input name="title" value={form.title} onChange={update} placeholder="e.g. Finish DBMS assignment" required maxLength="120" /></label>
        <div className="two-fields">
          <label>Subject<input name="subject" value={form.subject} onChange={update} placeholder="e.g. Database Systems" maxLength="60" /></label>
          <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>
        </div>
        <label>Description<textarea name="description" value={form.description} onChange={update} placeholder="Notes, links, or the next step…" rows="4" maxLength="1000" /></label>
        <div className="two-fields">
          <label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Status<select name="status" value={form.status} onChange={update}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
        </div>
        {error && <div className="alert error">{error}</div>}
        <div className="form-actions"><Link className="button secondary" to="/">Cancel</Link><button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save task"} <Save size={16} /></button></div>
      </form>
    </div>
  </div>;
}
