import React from "react";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <BookOpen className="text-primary-600 h-8 w-8" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            BookShelf
          </span>
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} BookShelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
