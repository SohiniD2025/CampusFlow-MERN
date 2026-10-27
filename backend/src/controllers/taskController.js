const mongoose = require("mongoose");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

exports.getTasks = asyncHandler(async (req, res) => {
  const { search = "", status = "All" } = req.query;
  const query = { user: req.user._id };
  if (status !== "All") query.status = status;
  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { subject: { $regex: search.trim(), $options: "i" } }
    ];
  }
  const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
  res.json(tasks);
});

exports.getTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400); throw new Error("Invalid task ID.");
  }
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) { res.status(404); throw new Error("Task not found."); }
  res.json(task);
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, subject, description, dueDate, priority, status } = req.body;
  if (!title?.trim()) { res.status(400); throw new Error("Task title is required."); }
  const task = await Task.create({
    title: title.trim(), subject, description,
    dueDate: dueDate || null, priority, status, user: req.user._id
  });
  res.status(201).json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400); throw new Error("Invalid task ID.");
  }
  const allowed = ["title", "subject", "description", "dueDate", "priority", "status"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  if (updates.title !== undefined && !updates.title.trim()) {
    res.status(400); throw new Error("Task title cannot be empty.");
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  if (!task) { res.status(404); throw new Error("Task not found."); }
  res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400); throw new Error("Invalid task ID.");
  }
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) { res.status(404); throw new Error("Task not found."); }
  res.json({ message: "Task deleted successfully." });
});
