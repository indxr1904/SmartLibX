import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";

export default function BookCopies() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [copies, setCopies] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  /* Add Copy */
  const handleAdd = () => navigate(`/admin/addcopies/${id}`);
  const handleBack = () => navigate("/admin/bookmanagement");

  const handleEdit = (copyId) => navigate(`/admin/editcopy/${copyId}`);

  const handleDelete = async (copyId) => {
    if (!confirm("Are you sure you want to delete this copy?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/copies/${copyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCopies();
        alert("Copy deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "available") return "bg-green-100 text-green-700";
    if (status === "issued") return "bg-yellow-100 text-yellow-700";
    if (status === "damaged") return "bg-red-100 text-red-600";
    if (status === "lost") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  /* Fetch Paginated Copies */
  const fetchCopies = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/copies/book/${id}/paginated?page=${page}&limit=${limit}`
      );
      const result = await res.json();

      setCopies(result.copies || result?.data?.copies || []);
      setTotalPages(result.totalPages || result.data?.totalPages || 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCopies();
  }, [page]);

  return (
    <div className="w-full">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900">Book Copies</h1>
      <p className="text-gray-600 mt-1">Manage all copies of this book.</p>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handleBack}
          className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 
          text-gray-700 hover:bg-gray-200"
        >
          ← Back
        </button>

        <button
          onClick={handleAdd}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Copy
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4 text-gray-600 font-semibold">Book Title</th>
              <th className="p-4 text-gray-600 font-semibold">Copy Code</th>
              <th className="p-4 text-gray-600 font-semibold">Status</th>
              <th className="p-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {copies.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No copies found
                </td>
              </tr>
            ) : (
              copies.map((copy) => (
                <tr
                  key={copy._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">{copy.bookId?.title || "-"}</td>

                  <td className="p-4">{copy.copycode}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        copy.status
                      )}`}
                    >
                      {copy.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3 text-lg">
                      <button
                        onClick={() => handleEdit(copy._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(copy._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <ImBin />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-200"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border border-gray-200 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
