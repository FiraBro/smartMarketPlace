import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Listing",
          required: true,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },

        // Escrow + Payment proof per product
        status: {
          type: String,
          enum: [
            "pending",
            "payment_submitted",
            "funds_held",
            "shipped",
            "completed",
            "disputed",
            "cancelled",
          ],
          default: "pending",
        },
        paymentProof: {
          imageUrl: String,
          transactionId: String,
          uploadedAt: Date,
        },
        dispute: {
          reason: String,
          messages: [
            {
              sender: String,
              message: String,
              date: Date,
            },
          ],
          resolved: { type: Boolean, default: false },
        },
      },
    ],

    totalPrice: { type: Number, required: true },

    // Address & delivery info
    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup", "standard", "express"],
      default: "delivery",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: function () {
        return this.deliveryMethod === "delivery";
      },
    },

    // Overall payment tracking (optional)
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Completed", "Failed"],
      default: "Pending",
    },

    isPaid: { type: Boolean, default: false }, // for future total payment flag
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
