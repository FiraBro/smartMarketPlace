// import Admin from "../models/Admin.js";
// import AppError from "./AppError.js";
// import catchAsync from "./catchAsync.js";

// export const seedFirstAdmin = catchAsync(async () => {
//   const existingAdmin = await Admin.findOne({});
//   if (existingAdmin) {
//     throw new AppError("Admin already exists ✔", 400);
//   }

//   // Detect environment
//   const isProduction = process.env.NODE_ENV === "production";

//   // Set email and password based on environment
//   const email = isProduction
//     ? process.env.FIRST_ADMIN_EMAIL
//     : "admin@example.com";

//   const plainPassword = isProduction
//     ? process.env.FIRST_ADMIN_PASSWORD
//     : "SuperSecurePassword123";

//   if (!email || !plainPassword) {
//     throw new AppError(
//       "Admin email or password is missing in environment variables",
//       500
//     );
//   }

//   // Create the first super admin
//   await Admin.create({
//     email,
//     password: plainPassword,
//     role: "super-admin", // full access
//   });

//   console.log(`✅ First super admin created: ${email}`);
// });

import Admin from "../models/Admin.js";

export const seedFirstAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log("✔ Admin already exists, skipping seeding");
      return; // don't throw, just skip
    }

    const isProduction = process.env.NODE_ENV === "production";

    const email = isProduction
      ? process.env.FIRST_ADMIN_EMAIL
      : "admin@example.com";

    const plainPassword = isProduction
      ? process.env.FIRST_ADMIN_PASSWORD
      : "SuperSecurePassword123";

    if (!email || !plainPassword) {
      console.error(
        "❌ Admin email or password is missing in environment variables"
      );
      return;
    }

    await Admin.create({
      email,
      password: plainPassword,
      role: "super-admin",
    });

    console.log(`✅ First super admin created: ${email}`);
  } catch (err) {
    console.error("❌ Error while seeding admin:", err.message);
  }
};
