import { productService } from "../services/productService.js";

export async function listProducts(req, res) {
  const { search = "", page = 1, limit = 12 } = req.validated.query;
  const data = await productService.getProducts({ search, page, limit });

  res.json({
    success: true,
    data
  });
}

export async function getProduct(req, res) {
  const { slug } = req.validated.params;
  const data = await productService.getProductBySlug(slug);

  res.json({
    success: true,
    data
  });
}
