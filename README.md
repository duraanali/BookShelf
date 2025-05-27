# Bookshelf

A full-stack web application for managing your personal book collection, built with React, Express, and SQLite. Bookshelf provides a modern interface for book management with features like authentication, book listing, and more.

## Features

- User authentication (login/register)
- Book management (add, edit, delete)
- Modern UI with Tailwind CSS
- Responsive design
- Form validation with React Hook Form and Zod
- State management with Redux Toolkit
- RESTful API with Express
- SQLite database

## Tech Stack

### Frontend

- React 18
- Vite
- Redux Toolkit
- React Router DOM
- React Hook Form
- Tailwind CSS
- Axios
- Zod (validation)

### Backend

- Express.js
- SQLite3
- JWT Authentication
- CORS

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bookshelf
```

2. Install dependencies for both frontend and backend:

```bash
npm run install:all
```

3. Set up the database:

```bash
cd server
npm run setup-db
cd ..
```

## Running the Application

To run both frontend and backend concurrently:

```bash
npm run dev:all
```

Or run them separately:

Frontend (development):

```bash
npm run dev
```

Backend (development):

```bash
npm run server
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run server` - Start the backend development server
- `npm run dev:all` - Start both frontend and backend concurrently
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run install:all` - Install dependencies for both frontend and backend

## Project Structure

```
bookshelf/
├── src/               # Frontend source code
├── server/           # Backend source code
│   ├── db/          # Database setup and migrations
│   ├── routes/      # API routes
│   └── server.js    # Main server file
├── public/          # Static assets
└── package.json     # Project configuration
```

## API Endpoints

The backend provides the following main endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
