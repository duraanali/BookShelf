const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create a database file in the db directory
const dbPath = path.join(__dirname, "books.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
    return;
  }
  console.log("Connected to the SQLite database.");
});

// Helper function to run SQL queries with promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error running sql: " + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper function to get a single row
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        console.error("Error running sql: " + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// Helper function to get all rows
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Error running sql: " + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Database operations for books
const booksDb = {
  db: new sqlite3.Database(dbPath),

  getAll: () => {
    return new Promise((resolve, reject) => {
      booksDb.db.all(
        `SELECT id, title, description, image, genre, authorId, authorName,
        datetime(created_at) as createdAt
        FROM books`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      booksDb.db.get(
        `SELECT id, title, description, image, genre, authorId, authorName,
        datetime(created_at) as createdAt
        FROM books WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  create: (book) => {
    return new Promise((resolve, reject) => {
      const { title, description, image, genre, authorId, authorName } = book;
      booksDb.db.run(
        `INSERT INTO books (
          title, description, image, genre, authorId, authorName
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, image, genre, authorId, authorName],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  update: (id, book) => {
    return new Promise((resolve, reject) => {
      const { title, description, image, genre, authorId, authorName } = book;
      booksDb.db.run(
        `UPDATE books SET 
          title = ?, description = ?, image = ?, 
          genre = ?, authorId = ?, authorName = ? 
        WHERE id = ?`,
        [title, description, image, genre, authorId, authorName, id],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      booksDb.db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  },
};

// Database operations for users
const usersDb = {
  // Get all users
  getAll: async () => {
    return await all("SELECT id, username, email FROM users");
  },

  // Get user by ID
  getById: async (id) => {
    return await get("SELECT id, username, email FROM users WHERE id = ?", [
      id,
    ]);
  },

  // Get user by username
  getByUsername: async (username) => {
    return await get("SELECT * FROM users WHERE username = ?", [username]);
  },

  // Create a new user
  create: async (user) => {
    const { username, email, password } = user;
    const result = await run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    return result.id;
  },

  // Update a user
  update: async (id, user) => {
    const { username, email, password } = user;
    await run(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, id]
    );
    return true;
  },

  // Delete a user
  delete: async (id) => {
    await run("DELETE FROM users WHERE id = ?", [id]);
    return true;
  },
};

module.exports = {
  db,
  run,
  get,
  all,
  booksDb,
  usersDb,
};
