import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../baseUrl";
import axios from "axios";

// Configure axios defaults for book requests
axios.defaults.withCredentials = true;

// Fetch books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
});

// Add book
export const addBook = createAsyncThunk("books/addBook", async (bookData) => {
  try {
    const response = await axios.post(`${BASE_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
});

// Update book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }) => {
    try {
      const response = await axios.put(`${BASE_URL}/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
);

// Delete book
export const deleteBook = createAsyncThunk("books/deleteBook", async (id) => {
  try {
    await axios.delete(`${BASE_URL}/books/${id}`);
    return id;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
});

const initialState = {
  books: [],
  status: "idle", // "loading", "succeeded", "failed"
  error: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch books cases
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add book cases
      .addCase(addBook.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books.push(action.payload);
        state.error = null;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update book cases
      .addCase(updateBook.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete book cases
      .addCase(deleteBook.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = state.books.filter((book) => book.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default bookSlice.reducer;
