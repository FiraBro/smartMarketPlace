import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const seedFirstAdmin = async () => {
  const existingAdmin = await Admin.findOne({});
  if (existingAdmin) {
    console.log("Admin already exists ✔");
    return;
  }

  const defaultPassword = "SuperSecurePassword123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await Admin.create({
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ First admin created: admin@example.com");
};
