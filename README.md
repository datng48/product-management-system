# Product Management API

A NestJS REST API for product management with like functionality and API caching.

## Features

- Authentication with JWT
- Product CRUD operations
- Search functionality
- Like/unlike products
- API response caching

## API Endpoints

### Authentication

- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login and get access token

### Products

- **GET /products** - Retrieve all products (with pagination)
- **POST /products** - Add a new product (Authentication required)
- **GET /products/search?q=** - Search products by name
- **POST /products/:id/like** - Like/unlike a product (Authentication required)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a PostgreSQL database
4. Configure environment variables in `.env` file
5. Run the application: `npm run start:dev`

## Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=product_management
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Usage Examples

### Register a user

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"user1","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"user1","password":"password123"}'
```

### Create a product (with authentication)

```bash
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"name":"Product 1","price":99.99,"category":"Electronics","subcategory":"Laptops"}'
```

### Get products (with pagination)

```bash
curl -X GET "http://localhost:3000/products?page=1&limit=10"
```

### Search products

```bash
curl -X GET "http://localhost:3000/products/search?q=laptop"
```

### Like a product

```bash
curl -X POST http://localhost:3000/products/1/like -H "Authorization: Bearer YOUR_JWT_TOKEN"
``` 