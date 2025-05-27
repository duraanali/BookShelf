import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  image: z
    .string()
    .url("Please enter a valid image URL")
    .min(1, "Image URL is required"),

  genre: z
    .string()
    .min(2, "Genre must be at least 2 characters")
    .max(50, "Genre must be less than 50 characters"),

  authorId: z.number(),
  authorName: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Biography",
  "History",
  "Poetry",
  "Children's",
  "Young Adult",
  "Self-Help",
  "Business",
  "Technology",
  "Science",
  "Arts & Culture",
];
