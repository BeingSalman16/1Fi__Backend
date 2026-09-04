# 1Fi SDE1 Assignment — EMI Marketplace

A production-style full-stack product page for smartphones with EMI plans backed by mutual funds.

## Requirements covered

- Dynamic product + variant + EMI plan data loaded from MongoDB through REST APIs.
- Unique product URLs such as `/products/iphone-17-pro`.
- 3 products with 2+ variants each.
- Product details: name, variant, MRP, selling price and image.
- EMI plans: monthly payment, tenure, interest rate and cashback.
- Selectable EMI plan and "Proceed with selected plan" action.
- Responsive React UI inspired by the supplied assignment reference.
- Express backend organized using MVC + service/repository-style separation.
- Validation, centralized errors, security headers, CORS, rate limiting and request logging.
- Seed data included.

## Tech stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- Mongoose
- MongoDB
- Zod
- Helmet
- CORS
- express-rate-limit
- Morgan

## Project structure

```text
1fi-emi-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── docker-compose.yml
```

## 1. Start MongoDB

The easiest option is Docker:

```bash
docker compose up -d mongodb
```

Or use an existing MongoDB instance.

## 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

## 3. Frontend

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API endpoints

### Health

`GET /api/health`

### Products

`GET /api/products`

Optional query parameters:

- `search`
- `page`
- `limit`

Example:

`GET /api/products?search=iphone&page=1&limit=10`

### Single product

`GET /api/products/:slug`

Example:

`GET /api/products/iphone-17-pro`

### Example response

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "66...",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro"
    },
    "variants": [
      {
        "id": "66...",
        "color": "Silver",
        "storage": "256GB",
        "mrp": 134900,
        "price": 127400,
        "image": "https://..."
      }
    ],
    "emiPlans": [
      {
        "id": "66...",
        "months": 3,
        "monthlyPayment": 44967,
        "interestRate": 0,
        "cashback": 7500
      }
    ]
  }
}
```

## Database schema

### Product

```text
Product
- name
- slug
- brand
- description
- active
```

### ProductVariant

```text
ProductVariant
- productId -> Product
- color
- storage
- image
- mrp
- price
- available
```

### EmiPlan

```text
EmiPlan
- productId -> Product
- months
- monthlyPayment
- interestRate
- cashback
- provider
- active
```

A separate variant collection keeps product-level information normalized and makes it easy to add more colors/storage options without duplicating product data.

## Production deployment

### Backend

Deploy the `backend` directory to Render, Railway, Fly.io, etc.

Set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
CLIENT_URL=<your-vercel-frontend-url>
```

### Frontend

Deploy the `frontend` directory to Vercel.

Set:

```env
VITE_API_URL=<your-render-backend-url>/api
```

## Notes

The seed dataset intentionally uses realistic assignment data and image URLs. Frontend code does not contain product/EMI business data; all such data comes from the backend API.

## Troubleshooting

If `GET /api/products` returns `400`, make sure `backend/src/middlewares/validate.js` uses `req.body ?? {}` for GET requests. The included version already contains this fix.

If the API starts but the frontend cannot connect, confirm both `.env` files: frontend `VITE_API_URL=http://localhost:5000/api` and backend `CLIENT_URL=http://localhost:5173`.

If MongoDB connection fails, start MongoDB first with `docker compose up -d mongodb`, then run `npm run seed` from `backend`.
