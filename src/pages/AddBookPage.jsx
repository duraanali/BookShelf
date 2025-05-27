import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bookSchema, genres } from "../schemas/book";
import { addBook } from "../store/slices/bookSlice";
import { BookOpen, Save, X, AlertCircle } from "lucide-react";

const AddBookPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      authorId: user?.id,
      authorName: user?.username,
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      const bookData = {
        ...data,
        authorId: user.id,
        authorName: user.username,
      };
      await dispatch(addBook(bookData)).unwrap();
      reset();
      navigate("/books");
    } catch (error) {
      console.error("Failed to add book:", error);
      setSubmitError(error.message || "Failed to add book. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center">
          <BookOpen className="mr-3 h-8 w-8 text-primary-600" />
          <h2 className="section-title">Add New Book</h2>
        </div>

        {submitError && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{submitError}</div>
              </div>
            </div>
          </div>
        )}

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
                  className={`input-field ${errors.title ? "border-red-300" : ""}`}
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
                  className={`input-field ${errors.genre ? "border-red-300" : ""}`}
                  defaultValue=""
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
                  className={`input-field ${errors.description ? "border-red-300" : ""}`}
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
                  className={`input-field ${errors.image ? "border-red-300" : ""}`}
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
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
