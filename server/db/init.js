const { db } = require("./database");

// Create tables
const createTables = async () => {
  // Create books table
  await db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      image TEXT
    )
  `);

  // Create users table
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  console.log("Tables created successfully");
};

// Insert sample data
const insertSampleData = async () => {
  try {
    // Check if books table is empty
    const books = await db.all("SELECT * FROM books");
    if (books.length === 0) {
      // Insert sample books
      await db.run(`
        INSERT INTO books (title, author, description, image)
        VALUES 
        ('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of decadence and excess.', 'https://example.com/gatsby.jpg'),
        ('To Kill a Mockingbird', 'Harper Lee', 'A classic of modern American literature.', 'https://example.com/mockingbird.jpg')
      `);
    }

    // Check if users table is empty
    const users = await db.all("SELECT * FROM users");
    if (users.length === 0) {
      // Insert sample user (password: password123)
      await db.run(`
        INSERT INTO users (username, email, password)
        VALUES ('admin', 'admin@example.com', '$2b$10$YourHashedPasswordHere')
      `);
    }

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    await createTables();
    await insertSampleData();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    db.close();
  }
};

initializeDatabase();
