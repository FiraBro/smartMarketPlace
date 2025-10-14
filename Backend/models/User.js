import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    phone: {
      type: String,
      // Make optional for OAuth users
      required: function () {
        return !this.oauthProvider;
      },
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationCodes: {
      email: { type: String },
      phone: { type: String },
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    password: {
      type: String,
      // Only required for regular email/password users
      required: function () {
        return !this.oauthProvider;
      },
    },

    oauthProvider: {
      type: String, // e.g., 'github', 'google'
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
