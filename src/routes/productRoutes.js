import { Router } from "express";
import { getProduct, listProducts } from "../controllers/productController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  productListSchema,
  productSlugSchema
} from "../validators/productValidator.js";

const router = Router();

router.get("/", validate(productListSchema), asyncHandler(listProducts));
router.get("/:slug", validate(productSlugSchema), asyncHandler(getProduct));

export default router;
