import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import Admin from "../models/Admin.js";
import Seller from "../models/Seller.js";
import AppError from "../utils/AppError.js";

// ---------------------
// Helper: create session object
// ---------------------
export const createSessionUser = (user) => ({
  _id: user._id,
  name: user.name || user.username || "Admin",
  email: user.email,
  role: user.role || "buyer",
  avatar: user.avatar || null,
});

// ---------------------
// Register user/admin
// ---------------------
export const registerUserService = async (data) => {
  const { name, email, password, passwordConfirm, role, phone, shopName } =
    data;

  // Admin registration
  if (role === "admin") {
    if (password !== passwordConfirm)
      throw new AppError("Passwords do not match", 400);
    const existing = await Admin.findOne({ email });
    if (existing) throw new AppError("Admin already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });
    return { user: admin, seller: null };
  }

  // Normal user registration
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("User already exists", 400);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "buyer",
    phone,
  });

  let seller = null;
  if (role === "seller") {
    seller = await Seller.create({
      user: user._id,
      shopName: shopName || `${name}'s Shop`,
      status: "pending",
    });
  }

  return { user, seller };
};

// ---------------------
// Login user/admin
// ---------------------
export const loginUserService = async ({ email, password }) => {
  // Try admin login
  let admin = await Admin.findOne({ email }).select("+password");
  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new AppError("Invalid credentials", 400);
    return { user: admin };
  }

  // Normal user login
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  return { user };
};

// ---------------------
// Update profile
// ---------------------
export const updateMeService = async (sessionUser, body, file) => {
  const { name, email, password, phone } = body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (password) updates.password = await bcrypt.hash(password, 10);
  if (file) updates.avatar = `/uploads/${file.filename}`;

  const Model = sessionUser.role === "admin" ? Admin : User;
  const updatedUser = await Model.findByIdAndUpdate(sessionUser._id, updates, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

// ---------------------
// Get all sellers or buyers
// ---------------------
export const getAllSellersService = async () => {
  return await User.find({ role: "seller" });
};

export const getAllBuyersService = async () => {
  return await User.find({ role: "buyer" });
};
