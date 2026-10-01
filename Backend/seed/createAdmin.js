import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
dotenv.config();

async function createAdmin() {
  try {
    // 🌟 FORCE DOCKER URI BYPASS: We use the smart-mongo container name explicitly here
    const dockerMongoUri = "mongodb://smart-mongo:27017/smartMarketplace";

    console.log(`Connecting to: ${dockerMongoUri}`);
    await mongoose.connect(dockerMongoUri);
    console.log("DB connected successfully.");

    // Fallbacks if dotenv is blank inside the container context
    const adminEmail = process.env.ADMIN_EMAIL || "admin@marketplace.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";

    // Delete any older entries to guarantee a clean slate
    await Admin.deleteMany({ email: adminEmail });
    console.log("Leave space for fresh insertion.");

    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(
      "✅ Admin created successfully inside Docker Admin collection!",
    );
    console.log(`Admin email: ${adminEmail}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
