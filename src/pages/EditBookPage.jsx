import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateBook } from "../store/slices/bookSlice";
import { bookSchema, genres } from "../schemas/book";
import { BookOpen, Save, X } from "lucide-react";

const EditBookPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { books } = useSelector((state) => state.books);
  const book = books.find((b) => b.id === parseInt(id));

  // Check if user is the author of the book
  const isAuthor = book && user && book.authorId === user.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      ...book,
      authorId: user?.id,
      authorName: user?.username,
    },
  });

  useEffect(() => {
    if (book) {
      reset({
        ...book,
        authorId: user?.id,
        authorName: user?.username,
      });
    }
  }, [book, reset, user]);

  const onSubmit = async (data) => {
    try {
      const bookData = {
        ...data,
        authorId: user.id,
        authorName: user.username,
      };
      await dispatch(updateBook({ id: parseInt(id), bookData })).unwrap();
      navigate("/books");
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">Book not found</p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/books")}
                className="btn-primary"
              >
                Go back to books
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Unauthorized
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You cannot edit this book
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/books")}
                className="btn-primary"
              >
                Go back to books
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center">
          <BookOpen className="mr-3 h-8 w-8 text-primary-600" />
          <h2 className="section-title">Edit Book</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card animate-fade-in">
            <div className="card-body space-y-6">
              <div>
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  className="input-field"
                  placeholder="Enter book title"
                />
                {errors.title && (
                  <p className="error-message">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="genre" className="form-label">
                  Genre
                </label>
                <select
                  id="genre"
                  {...register("genre")}
                  className="input-field"
                >
                  <option value="" disabled>
                    Select a genre
                  </option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="error-message">{errors.genre.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="input-field"
                  placeholder="Enter book description"
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="form-label">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  {...register("image")}
                  className="input-field"
                  placeholder="Enter cover image URL"
                />
                {errors.image && (
                  <p className="error-message">{errors.image.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="btn-secondary"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;
