import { productRepository } from "../repositories/productRepository.js";
import { AppError } from "../utils/appError.js";

function serializeId(item) {
  const { _id, ...rest } = item;
  return {
    ...rest,
    id: _id?.toString()
  };
}

export const productService = {
  async getProducts({ search = "", page = 1, limit = 12 }) {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.min(50, Math.max(1, Number(limit)));
    const skip = (safePage - 1) * safeLimit;

    const { items, total } = await productRepository.findProducts({
      search: search.trim(),
      skip,
      limit: safeLimit
    });

    return {
      items: items.map(serializeId),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    };
  },

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const [variants, emiPlans] = await Promise.all([
      productRepository.findVariants(product._id),
      productRepository.findEmiPlans(product._id)
    ]);

    if (!variants.length) {
      throw new AppError("Product has no available variants", 404);
    }

    return {
      product: serializeId(product),
      variants: variants.map(serializeId),
      emiPlans: emiPlans.map(serializeId)
    };
  }
};
