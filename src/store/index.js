import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import authReducer from "./slices/authSlice";

// Configure the redux store
const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
  },
});

export default store;
