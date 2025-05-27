import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Plus } from "lucide-react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Discover Your Next
            <br />
            Favorite Book
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
            {isAuthenticated
              ? "Share your literary works and connect with readers from around the world."
              : "Connect with authors and explore a diverse collection of literary works from around the world."}
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/books"
                  className="rounded-md bg-secondary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-secondary-600"
                >
                  Browse Books
                </Link>
                <Link
                  to="/add-book"
                  className="rounded-md border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Plus className="mr-2 -ml-1 inline-block h-5 w-5" />
                  Add New Book
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/books"
                  className="rounded-md bg-secondary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-secondary-600"
                >
                  Browse Books
                </Link>
                <Link
                  to="/register"
                  className="rounded-md border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Join as Author
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Why BookShelf Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why BookShelf?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary-100 p-3">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Showcase Your Work
              </h3>
              <p className="text-gray-600">
                Publish your books on a beautiful platform designed to highlight
                your literary achievements.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary-100 p-3">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Connect with Readers
              </h3>
              <p className="text-gray-600">
                Build your audience and engage with readers who appreciate your
                unique literary voice.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary-100 p-3">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Gain Recognition
              </h3>
              <p className="text-gray-600">
                Get your work in front of a wide audience and establish yourself
                in the literary community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Share Section */}
      {!isAuthenticated && (
        <div className="bg-secondary-500 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Share Your Story?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Join our community of authors and start showcasing your books to
              readers around the world.
            </p>
            <Link
              to="/register"
              className="inline-block rounded-md bg-white px-6 py-3 font-medium text-secondary-600 transition-colors hover:bg-gray-100"
            >
              Become an Author Today
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
