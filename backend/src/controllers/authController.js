const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createToken = require("../utils/createToken");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must contain at least 6 characters.");
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409);
    throw new Error("An account with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
  res.cookie("token", createToken(user._id), cookieOptions());
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.trim().toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
  res.cookie("token", createToken(user._id), cookieOptions());
  res.json({ _id: user._id, name: user.name, email: user.email });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });
  res.json({ message: "Logged out successfully." });
});
