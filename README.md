# BookShelf API Documentation

This document provides detailed information about the BookShelf API endpoints, their requirements, and expected responses.

## Base URL

```
http://localhost:3001
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication via a JWT token stored in an HTTP-only cookie.

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "username": "string", // required
  "email": "string", // required
  "password": "string" // required
}
```

**Response:**

- Status: 201 Created
- Body:

```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "username": "string", // required
  "password": "string" // required
}
```

**Response:**

- Status: 200 OK
- Body:

```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**

- Requires authentication cookie

**Response:**

- Status: 200 OK
- Body:

```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

#### Logout

```http
POST /api/auth/logout
```

**Response:**

- Status: 200 OK
- Body:

```json
{
  "message": "Logged out successfully"
}
```

## Book Endpoints

### Get All Books

```http
GET /api/books
```

**Response:**

- Status: 200 OK
- Body:

```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "image": "string",
    "genre": "string",
    "authorId": "number",
    "authorName": "string"
  }
]
```

### Get Book by ID

```http
GET /api/books/:id
```

**Parameters:**

- `id`: Book ID (number)

**Response:**

- Status: 200 OK
- Body:

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "image": "string",
  "genre": "string",
  "authorId": "number",
  "authorName": "string"
}
```

### Create Book

```http
POST /api/books
```

**Headers:**

- Requires authentication cookie

**Request Body:**

```json
{
  "title": "string", // required
  "description": "string", // required
  "image": "string", // required
  "genre": "string", // required
  "authorId": "number", // required, must match authenticated user
  "authorName": "string" // required
}
```

**Response:**

- Status: 201 Created
- Body: Created book object

### Update Book

```http
PUT /api/books/:id
```

**Headers:**

- Requires authentication cookie

**Parameters:**

- `id`: Book ID (number)

**Request Body:**

```json
{
  "title": "string", // required
  "description": "string", // required
  "image": "string", // required
  "genre": "string", // required
  "authorId": "number", // required, must match authenticated user
  "authorName": "string" // required
}
```

**Response:**

- Status: 200 OK
- Body: Updated book object

### Delete Book

```http
DELETE /api/books/:id
```

**Headers:**

- Requires authentication cookie

**Parameters:**

- `id`: Book ID (number)

**Response:**

- Status: 204 No Content

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

or

```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "error": "Unauthorized to edit this book"
}
```

### 404 Not Found

```json
{
  "error": "Book not found"
}
```

or

```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Notes

1. All protected routes require a valid JWT token in the HTTP-only cookie
2. Book operations (create, update, delete) can only be performed by the book's author
3. The server runs on port 3001 by default
4. CORS is enabled for the frontend running on `http://localhost:5173`
