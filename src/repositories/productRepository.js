import { Product } from "../models/Product.js";
import { ProductVariant } from "../models/ProductVariant.js";
import { EmiPlan } from "../models/EmiPlan.js";

export const productRepository = {
  async findProducts({ search, skip, limit }) {
    const filter = { active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    const [items, total] = await Promise.all([
      Product.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "productvariants",
            localField: "_id",
            foreignField: "productId",
            as: "variants"
          }
        },
        {
          $addFields: {
            minPrice: { $min: "$variants.price" },
            firstImage: { $arrayElemAt: ["$variants.image", 0] }
          }
        },
        {
          $project: {
            variants: 0
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]),
      Product.countDocuments(filter)
    ]);

    return { items, total };
  },

  async findBySlug(slug) {
    return Product.findOne({ slug, active: true }).lean();
  },

  async findVariants(productId) {
    return ProductVariant.find({
      productId,
      available: true
    }).sort({ price: 1 }).lean();
  },

  async findEmiPlans(productId) {
    return EmiPlan.find({
      productId,
      active: true
    }).sort({ months: 1 }).lean();
  }
};
