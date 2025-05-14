
This guideline provides guide on how to setup the NestJS project and GraphQL execution

## Getting Started NestJS

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables in `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret
PORT=3000
```
4. Start the application:
```bash
npm run dev
```

## Getting Started ReactJS
### Prerequisites
- React.js (v19.1.0 or other versions still ok, or can install via vite and add @latest)
- Tailwind CSS
- Ant design

### Installation

1. Run ``` npm install tailwindcss @tailwindcss/vite ```
2. Install FE dependencies:
```bash
npm install
```
3. Start the client:
```
npm start
```

### Explaination of caching, optimization strategies, and like feature:
* Caching, in this project I basically defining a built-in Nestjs's lib called cache-manager, which will cache the less likely to change data, or not usually change data, with a TTL to be not too long, not too short ( e.g 300 seconds ) so that it will improve performance by not making API calls to the database to get frequently used data too often, and invalidate the data by deleting the stale data.
* Optimization strategies:
  * Organized components for better reusability
  * Optimized components rendering based on state
  * Implemented pagination handling, fetching a specific number of pages instead all at once, improve performance significantly
* Like feature:
* Many-to-many relationship:
  * User entity: 1 User can like many Products
  * Product entity: 1 Product can be liked by many Users
  * Toggle like:
    * Query to the db if a specific user has already liked the product:
      * if not then update like to the db and invalidate the data ( remove the stale data from cache )
      * if already liked, then update the db to remove like and invalidate the data

## Using the GraphQL API

### Accessing the GraphQL Playground

When the NestJS is running, you can access the GraphQL Playground at:
```
http://localhost:3000/graphql
```

# Queries

#### Fetch Products (with pagination)

```graphql
query GetProducts {
  products(filters: { page: 1, limit: 8 }) {
    items {
      id
      name
      price
      category
      subcategory
      likesCount
    }
    meta {
      totalItems
      itemCount
      itemsPerPage
      totalPages
      currentPage
    }
  }
}
```

#### Search Products

```graphql
query SearchProducts {
  searchProducts(query: "macbook") {
    id
    name
    price
    category
  }
}
```

### Mutations

#### Create Product

```graphql
mutation CreateProduct {
  createProduct(createProductInput: {
    name: "New macbook"
    price: 1200.00
    category: "Electronics"
    subcategory: "Assessories"
  }) {
    id
    name
    price
    category
    subcategory
  }
}
```

# API design

### Authentication

#### Register User
- **Endpoint**: `POST /auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```
  {
    "id": "number",
    "username": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

#### Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate a user
- **Request Body**:
  ```
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```
  {
    "access_token": "string",
    "user": {
      "id": "number",
      "username": "string"
    }
  }
  ```

### Products

#### Get All Products
- **Endpoint**: `GET /products`
- **Description**: Get products, with pagination support
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 8)
- **Authentication**: Optional, only be authenticated when triggering like / add product
- **Response**:
  ```
  {
    "items": [
      {
        "id": "number",
        "name": "string",
        "price": "number",
        "category": "string",
        "subcategory": "string",
        "createdAt": "date",
        "updatedAt": "date",
        "likesCount": "number",
        "liked": "boolean"
      }
    ],
    "meta": {
      "totalItems": "number",
      "itemCount": "number",
      "itemsPerPage": "number",
      "totalPages": "number",
      "currentPage": "number"
    },
    "links": {
      "first": "string",
      "previous": "string",
      "next": "string",
      "last": "string"
    }
  }
  ```

#### Search Products
- **Endpoint**: `GET /products/search`
- **Description**: Search for products by name
- **Query Parameters**:
  - `q`: string (search term)
- **Authentication**: Optional
- **Response**:
  ```
  [
    {
      "id": "number",
      "name": "string",
      "price": "number",
      "category": "string",
      "subcategory": "string",
      "createdAt": "date",
      "updatedAt": "date",
      "likesCount": "number",
      "liked": "boolean"
    }
  ]
  ```

#### Create Product
- **Endpoint**: `POST /products`
- **Description**: Create a new product
- **Authentication**: Required
- **Request Body**:
  ```
  {
    "name": "string",
    "price": "number",
    "category": "string",
    "subcategory": "string"
  }
  ```
- **Response**: The created product object

#### Like/Unlike Product
- **Endpoint**: `POST /products/:id/like`
- **Description**: Toggle like status for a product
- **Path Parameters**:
  - `id`: number (product ID)
- **Authentication**: Required
- **Response**:
  ```
  {
    "liked": "boolean",
    "likesCount": "number"
  }
  ```

## GraphQL API

### Queries

#### Get Products
```graphql
query GetProducts($filters: ProductFilterInput) {
  products(filters: $filters) {
    items {
      id
      name
      price
      category
      subcategory
      likesCount
    }
    meta {
      totalItems
      itemCount
      itemsPerPage
      totalPages
      currentPage
    }
  }
}
```

**Variables**:
```
{
  "filters": {
    "page": 1,
    "limit": 8,
    "category": "string",
    "subcategory": "string",
    "search": "string"
  }
}
```

#### Search Products
```graphql
query SearchProducts($query: String!) {
  searchProducts(query: $query) {
    id
    name
    price
    category
    subcategory
  }
}
```

**Variables**:
```
{
  "query": "search term"
}
```

### Mutations

#### Create Product
```graphql
mutation CreateProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    id
    name
    price
    category
    subcategory
  }
}
```

**Variables**:
```
{
  "createProductInput": {
    "name": "string",
    "price": 99.99,
    "category": "string",
    "subcategory": "string"
  }
}
```

## GraphQL Schema Types

### ProductModel
```graphql
type ProductModel {
  id: ID!
  name: String!
  price: Float!
  category: String!
  subcategory: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  likesCount: Int!
}
```

### PaginationMeta
```graphql
type PaginationMeta {
  totalItems: Int!
  itemCount: Int!
  itemsPerPage: Int!
  totalPages: Int!
  currentPage: Int!
}
```

### PaginatedProductsModel
```graphql
type PaginatedProductsModel {
  items: [ProductModel!]!
  meta: PaginationMeta!
}
```

### Input Types

#### ProductFilterInput
```graphql
input ProductFilterInput {
  search: String
  category: String
  subcategory: String
  page: Int = 1
  limit: Int = 8
}
```

#### CreateProductInput
```graphql
input CreateProductInput {
  name: String!
  price: Float!
  category: String!
  subcategory: String!
}
```

## Language translation support
![Image](https://github.com/user-attachments/assets/a0c70d71-4668-47d1-ba73-81bf71c6c195)


## GraphQL API triggerings

![Image](https://github.com/user-attachments/assets/cf037896-d91d-4d85-acdb-75a9acbfe447)
![Image](https://github.com/user-attachments/assets/d90f89a4-1f8a-41d0-bba3-21721abdb769)
![Image](https://github.com/user-attachments/assets/55f22ab2-fa42-4e10-b085-4b6d380bb1b4)

## Register / Login user and Add new post UI ( with authentication via JWT )
![Image](https://github.com/user-attachments/assets/657cf999-ac48-4751-99c1-9a6a6bd1b709)
![Image](https://github.com/user-attachments/assets/c3f66446-dc7b-4bea-99c1-9fd81ed96883)
![Image](https://github.com/user-attachments/assets/54556741-861e-4584-a52a-ef50ab745c6c)

## Searching functionality
![Image](https://github.com/user-attachments/assets/12e31679-1e98-435a-a87e-5e9b74ecadf0)
