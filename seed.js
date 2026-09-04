import mongoose from "mongoose";
import { connectDatabase } from "./src/config/database.js";
import { Product } from "./src/models/Product.js";
import { ProductVariant } from "./src/models/ProductVariant.js";
import { EmiPlan } from "./src/models/EmiPlan.js";

const image1 =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85";
const image2 =
  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85";
const image3 =
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85";
const image4 =
  "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=85";

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    description:
      "Premium smartphone with a high-performance processor, advanced cameras and a titanium-inspired finish.",
    variants: [
      { color: "Silver", storage: "256GB", mrp: 134900, price: 127400, image: image1 },
      { color: "Orange", storage: "256GB", mrp: 134900, price: 127400, image: image2 },
      { color: "Blue", storage: "512GB", mrp: 154900, price: 146900, image: image3 }
    ],
    emiPlans: [
      { months: 3, monthlyPayment: 44967, interestRate: 0, cashback: 7500 },
      { months: 6, monthlyPayment: 22483, interestRate: 0, cashback: 7500 },
      { months: 12, monthlyPayment: 11242, interestRate: 0, cashback: 7500 },
      { months: 24, monthlyPayment: 5621, interestRate: 0, cashback: 7500 },
      { months: 36, monthlyPayment: 4297, interestRate: 10.5, cashback: 7500 },
      { months: 48, monthlyPayment: 3385, interestRate: 10.5, cashback: 7500 },
      { months: 60, monthlyPayment: 2842, interestRate: 10.5, cashback: 7500 }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    description:
      "Flagship Android smartphone with a large display, powerful camera system and S Pen support.",
    variants: [
      { color: "Titanium Gray", storage: "256GB", mrp: 129999, price: 114999, image: image2 },
      { color: "Titanium Black", storage: "512GB", mrp: 139999, price: 124999, image: image3 },
      { color: "Titanium Violet", storage: "1TB", mrp: 159999, price: 144999, image: image4 }
    ],
    emiPlans: [
      { months: 3, monthlyPayment: 38333, interestRate: 0, cashback: 6000 },
      { months: 6, monthlyPayment: 19167, interestRate: 0, cashback: 6000 },
      { months: 12, monthlyPayment: 9583, interestRate: 0, cashback: 6000 },
      { months: 24, monthlyPayment: 5200, interestRate: 10.5, cashback: 6000 },
      { months: 36, monthlyPayment: 3830, interestRate: 10.5, cashback: 6000 },
      { months: 48, monthlyPayment: 3020, interestRate: 10.5, cashback: 6000 }
    ]
  },
  {
    name: "Google Pixel 9 Pro",
    slug: "google-pixel-9-pro",
    brand: "Google",
    description:
      "AI-powered flagship phone with a polished camera experience, vivid display and clean Android software.",
    variants: [
      { color: "Obsidian", storage: "128GB", mrp: 109999, price: 99999, image: image3 },
      { color: "Porcelain", storage: "256GB", mrp: 119999, price: 109999, image: image4 },
      { color: "Hazel", storage: "512GB", mrp: 139999, price: 124999, image: image1 }
    ],
    emiPlans: [
      { months: 3, monthlyPayment: 33333, interestRate: 0, cashback: 5000 },
      { months: 6, monthlyPayment: 16667, interestRate: 0, cashback: 5000 },
      { months: 12, monthlyPayment: 8333, interestRate: 0, cashback: 5000 },
      { months: 24, monthlyPayment: 4540, interestRate: 10.5, cashback: 5000 },
      { months: 36, monthlyPayment: 3350, interestRate: 10.5, cashback: 5000 },
      { months: 48, monthlyPayment: 2640, interestRate: 10.5, cashback: 5000 }
    ]
  }
];

async function seed() {
  await connectDatabase();

  await Promise.all([
    Product.deleteMany({}),
    ProductVariant.deleteMany({}),
    EmiPlan.deleteMany({})
  ]);

  for (const item of products) {
    const { variants, emiPlans, ...productData } = item;
    const product = await Product.create(productData);

    await ProductVariant.insertMany(
      variants.map((variant) => ({
        ...variant,
        productId: product._id
      }))
    );

    await EmiPlan.insertMany(
      emiPlans.map((plan) => ({
        ...plan,
        productId: product._id
      }))
    );
  }

  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
