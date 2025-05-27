import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook } from "../../store/slices/bookSlice";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAuthor = user && book.authorId === user.id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBook(book.id)).unwrap();
      } catch (error) {
        console.error("Failed to delete book:", error);
      }
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={
            book.image || "https://via.placeholder.com/300x400?text=No+Image"
          }
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          {book.title}
        </h3>
        <p className="mb-2 text-sm text-gray-600">By {book.authorName}</p>
        <p className="mb-2 text-sm text-gray-500">
          {book.genre} • {format(new Date(book.createdAt), "MMM d, yyyy")}
        </p>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {book.description}
        </p>
        {isAuthor && (
          <div className="flex justify-end space-x-2">
            <Link
              to={`/edit-book/${book.id}`}
              className="rounded-md bg-primary-100 p-2 text-primary-600 hover:bg-primary-200"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
