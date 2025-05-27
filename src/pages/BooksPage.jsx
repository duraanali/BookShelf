import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, BookOpen, AlertCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../store/slices/bookSlice";
import BookCard from "../components/books/BookCard";

const BooksPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { books, status, error } = useSelector((state) => state.books);
  const [showMyBooks, setShowMyBooks] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Get unique genres from books (no useMemo)
  const genresSet = new Set(books.map((book) => book.genre));
  const availableGenres = Array.from(genresSet).sort();

  const handleGenreClick = (genre) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };

  // Filter books by user and genre
  const filteredBooks = books
    .filter((book) => {
      if (showMyBooks && user) {
        return book.authorId === user.id;
      }
      return true;
    })
    .filter((book) => {
      if (selectedGenre) {
        return book.genre === selectedGenre;
      }
      return true;
    });

  return (
    <>
      <div className="bg-primary-700 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold">Latest Books</h1>
              <p className="mt-2 text-primary-100">
                Discover and explore new literary works from talented authors
              </p>
            </div>
            {isAuthenticated && (
              <Link
                to="/add-book"
                className="rounded-md bg-secondary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-secondary-600"
              >
                <Plus className="mr-2 -ml-1 inline-block h-5 w-5" />
                Add New Book
              </Link>
            )}
          </div>

          <div className="mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                className="w-full rounded-lg bg-white/10 px-4 py-3 pl-10 text-white placeholder-white/60 backdrop-blur-sm transition-colors focus:bg-white/20 focus:outline-none"
                disabled
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowMyBooks(false)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              !showMyBooks
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Books
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setShowMyBooks(true)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                showMyBooks
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Books
            </button>
          )}
          {availableGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                selectedGenre === genre
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Book list rendering logic moved here */}
        {status === "loading" ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              <p className="mt-4 text-sm text-gray-600">
                Discovering great books...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="rounded-lg bg-red-50 p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {showMyBooks
                  ? "You haven't added any books yet"
                  : selectedGenre
                    ? `No ${selectedGenre} books found`
                    : "No books found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {showMyBooks
                  ? "Start sharing your literary works with the community"
                  : selectedGenre
                    ? "Try a different genre or check back later"
                    : "Check back soon for new additions"}
              </p>
              {isAuthenticated && showMyBooks && (
                <div className="mt-6">
                  <Link
                    to="/add-book"
                    className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Share your first book
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BooksPage;
