import mongoose from "mongoose";

const emiPlanSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    months: {
      type: Number,
      required: true,
      min: 1
    },
    monthlyPayment: {
      type: Number,
      required: true,
      min: 0
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0
    },
    cashback: {
      type: Number,
      default: 0,
      min: 0
    },
    provider: {
      type: String,
      default: "1Fi Mutual Fund Backed EMI"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

emiPlanSchema.index({ productId: 1, months: 1 }, { unique: true });

export const EmiPlan = mongoose.model("EmiPlan", emiPlanSchema);
