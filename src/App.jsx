import React, { useEffect} from "react"
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import { checkAuthStatus } from "./store/slices/authSlice";

// Pages
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import AddBookPage from "./pages/AddBookPage";
import EditBookPage from "./pages/EditBookPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />

          
          <Route path="/add-book" element={
            <ProtectedRoutes requireAuth={true}>
              <AddBookPage />
            </ProtectedRoutes>
            } />
          <Route path="/edit-book/:id" element={
            <ProtectedRoutes requireAuth={true}>
              <EditBookPage />
            </ProtectedRoutes>
            } />
          <Route path="/login" element={
            <ProtectedRoutes requireAuth={false}>
              <LoginPage />
            </ProtectedRoutes>
            } />
          <Route path="/register" element={
            <ProtectedRoutes requireAuth={false}>
              <RegisterPage />
            </ProtectedRoutes>
           } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
