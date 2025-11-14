import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: {
      type: [
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
      default: [],
    },

    totalPrice: { type: Number, required: true },

    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup", "standard", "express"],
      default: "delivery",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: function () {
        return ["delivery", "standard", "express"].includes(
          this.deliveryMethod
        );
      },
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Completed", "Failed"],
      default: "Pending",
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
  },
  { timestamps: true }
);

// Indexes for faster queries
orderSchema.index({ buyerId: 1 });
orderSchema.index({ "products.sellerId": 1 });

export default mongoose.model("Order", orderSchema);
