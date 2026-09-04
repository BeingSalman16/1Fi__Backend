import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    storage: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    mrp: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

variantSchema.index({ productId: 1, color: 1, storage: 1 }, { unique: true });

export const ProductVariant = mongoose.model("ProductVariant", variantSchema);
