const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { booksDb, usersDb } = require("./db/database");
const path = require("path");
const { exec } = require("child_process");

const app = express();

// JWT Secret Key
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

// Cookie options for JWT
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents JavaScript access to the cookie
  secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
  sameSite: "strict", // Protects against CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Enable CORS for the frontend with credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Important for cookies
  })
);

// Middleware to parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Middleware to verify JWT token from cookie
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("jwt");
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Initialize the database
const setupDb = () => {
  return new Promise((resolve, reject) => {
    const setupScript = path.join(__dirname, "db", "setup.js");
    exec(`node ${setupScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing setup script: ${error}`);
        reject(error);
        return;
      }
      console.log(`Database setup output: ${stdout}`);
      resolve();
    });
  });
};

// User Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if username already exists
    const existingUser = await usersDb.getByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const id = await usersDb.create({ username, email, password });
    const newUser = await usersDb.getById(id);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set JWT in HTTP-only cookie
    res.cookie("jwt", token, COOKIE_OPTIONS);

    // Don't send password in response
    delete newUser.password;
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists and password matches
    const user = await usersDb.getByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set JWT in HTTP-only cookie
    res.cookie("jwt", token, COOKIE_OPTIONS);

    // Don't send password in response
    delete user.password;
    res.json({ user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this after the login endpoint and before the protected routes
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await usersDb.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Don't send password in response
    delete user.password;
    res.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this after the /api/auth/me endpoint
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

// Protected routes
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await usersDb.getAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await usersDb.getById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send password in response
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await usersDb.getById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if new username is taken by another user
    const userWithUsername = await usersDb.getByUsername(username);
    if (userWithUsername && userWithUsername.id !== id) {
      return res.status(400).json({ error: "Username already exists" });
    }

    await usersDb.update(id, { username, email, password });
    const updatedUser = await usersDb.getById(id);

    // Don't send password in response
    delete updatedUser.password;
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if user exists
    const existingUser = await usersDb.getById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await usersDb.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Book Routes
app.get("/api/books", async (req, res) => {
  try {
    const books = await booksDb.getAll();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await booksDb.getById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected book routes
app.post("/api/books", verifyToken, async (req, res) => {
  try {
    const book = req.body;

    // Validate required fields
    if (
      !book.title ||
      !book.description ||
      !book.image ||
      !book.genre ||
      !book.authorId ||
      !book.authorName
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert authorId to number for comparison
    const bookAuthorId = Number(book.authorId);
    const userId = Number(req.user.id);

    // Verify that the authorId matches the authenticated user
    if (bookAuthorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to create book for another user" });
    }

    const id = await booksDb.create(book);
    const newBook = await booksDb.getById(id);

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/books/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = req.body;

    // Check if book exists
    const existingBook = await booksDb.getById(id);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Convert authorId to number for comparison
    const bookAuthorId = Number(existingBook.authorId);
    const userId = Number(req.user.id);

    // Check if user is the author
    if (bookAuthorId !== userId) {
      return res.status(403).json({ error: "Unauthorized to edit this book" });
    }

    // Validate required fields
    if (
      !book.title ||
      !book.description ||
      !book.image ||
      !book.genre ||
      !book.authorId ||
      !book.authorName
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await booksDb.update(id, book);
    const updatedBook = await booksDb.getById(id);

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/books/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if book exists
    const existingBook = await booksDb.getById(id);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Convert authorId to number for comparison
    const bookAuthorId = Number(existingBook.authorId);
    const userId = Number(req.user.id);

    // Check if user is the author
    if (bookAuthorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this book" });
    }

    await booksDb.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3001;

// Initialize the database and start the server
setupDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
