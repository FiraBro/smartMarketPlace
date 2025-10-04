import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Listing",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    // ✅ Link to saved Address (required only if delivery)
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: function () {
        return this.deliveryMethod === "delivery";
      },
    },

    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
      default: "delivery",
    },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "paid",
      ],
      default: "pending",
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    paymentMethod: {
      type: String,
      enum: ["COD", "TeleBirr"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
