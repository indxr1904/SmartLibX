import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImBook } from "react-icons/im";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { BsPlus } from "react-icons/bs";

export default function BookManagement() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // per page
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "All Categories",
    "BCA",
    "CSE",
    "IT",
    "CIVIL",
    "MECHINICAL",
    "ELECTRICAL",
    "ELECTRONICS",
  ];

  // Fetch paginated books
  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        category: selectedCategory === "All Categories" ? "" : selectedCategory,
      });

      const res = await fetch(
        `https://smartlibx.onrender.com/api/v1/books/paginated?${params.toString()}`
      );
      const result = await res.json();

      setBooks(result?.books || []);
      setTotalPages(result?.totalPages || 1);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  // Fetch whenever page, search, or category changes
  useEffect(() => {
    fetchBooks();
  }, [page, search, selectedCategory]);

  const handleAddBook = () => navigate("/admin/addbook");
  const handleEdit = (id) => navigate(`/admin/editbook/${id}`);
  const handleCopy = (id) => navigate(`/admin/bookcopies/${id}`);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(
        `https://smartlibx.onrender.com/api/v1/books/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        fetchBooks(); // Reload page after deletion
        alert("Book deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const badgeClass = (cat) => {
    const colors = {
      BCA: "bg-blue-100 text-blue-600",
      CSE: "bg-green-100 text-green-600",
      IT: "bg-purple-100 text-purple-600",
      Civil: "bg-yellow-100 text-yellow-600",
      default: "bg-gray-100 text-gray-600",
    };
    return colors[cat] || colors.default;
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
      <p className="text-gray-600 mt-1">
        Manage and organize all the books in your library.
      </p>

      {/* SEARCH + CATEGORY + ADD */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-1/2 relative">
          {/* Search Icon */}
          <FcSearch className="absolute left-3 top-4 text-xl text-gray-500" />

          <input
            type="text"
            placeholder="Search by Title, Author, or ISBN..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            className="border border-gray-200 px-4 py-3 rounded-lg bg-white w-full sm:w-auto"
            value={selectedCategory}
            onChange={(e) => {
              setPage(1);
              setSelectedCategory(e.target.value);
            }}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={handleAddBook}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto flex items-center"
          >
            <BsPlus size={20} /> Add New Book
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">ISBN</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book._id}
                  className="border-t border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.isbn}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${badgeClass(
                        book.category
                      )}`}
                    >
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-4 text-xl">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(book._id)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(book._id)}
                      >
                        <ImBin />
                      </button>

                      <button
                        className="text-gray-700 hover:text-gray-900"
                        onClick={() => handleCopy(book._id)}
                      >
                        <ImBook />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION UI (REAL) */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-40"
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-40"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
