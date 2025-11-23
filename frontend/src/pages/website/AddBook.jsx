import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/books", {
        title,
        author,
        isbn,
        category,
      });

      alert("Book Added successfully ✅");
      navigate("/admin/bookmanagement");
    } catch (err) {
      console.error(err);
      alert("Book not Added ❌");
    }
  };

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
      <p className="text-gray-600 mt-1">
        Fill in the details below to add a new book to the library.
      </p>

      {/* FORM CARD */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow border border-gray-200 max-w-4xl">
        <form onSubmit={handleAddBook} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/bookmanagement")}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg border outline-none border-gray-200 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
