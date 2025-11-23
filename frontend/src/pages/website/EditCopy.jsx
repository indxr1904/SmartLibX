import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCopy() {
  const { id } = useParams();

  const [bookId, setBookId] = useState("");
  const [copycode, setCopyCode] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  /* Fetch copy details */
  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/copies/${id}`).then((res) => {
      const copy = res.data.data.copy;
      setBookId(copy.bookId);
      setCopyCode(copy.copycode);
      setStatus(copy.status);
    });
  }, [id]);

  /* Update Handler */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/api/v1/copies/${id}`, {
        bookId,
        copycode,
        status,
      });

      alert("Updated successfully ✅");
      navigate(`/admin/bookcopies/${bookId}`);
    } catch (err) {
      console.error(err);
      alert("Updation failed ❌");
    }
  };

  /* Status Color Logic */
  const getStatusColor = (value) => {
    if (value === "available") return "bg-green-100 text-green-600";
    if (value === "issued") return "bg-yellow-100 text-yellow-700";
    if (value === "damaged") return "bg-red-100 text-red-600";
    if (value === "lost") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-900">Edit Copy</h1>
      <p className="text-gray-600 mt-1">Update details of this book copy.</p>

      <div className="mt-8 bg-white p-8 rounded-xl shadow border border-gray-200 max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* BOOK ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Book ID
            </label>
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50
              focus:ring-2 focus:ring-gray-300 outline-none"
              required
            />
          </div>

          {/* COPY CODE */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Copy Code
            </label>
            <input
              type="text"
              value={copycode}
              onChange={(e) => setCopyCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 
              focus:ring-2 focus:ring-gray-300 outline-none"
              required
            />
          </div>

          {/* STATUS (Select with colored label preview) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 
              focus:ring-2 focus:ring-gray-300 outline-none cursor-pointer"
              required
            >
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </select>

            {/* Preview colored tag */}
            {status && (
              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/bookcopies/${bookId}`)}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Copy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
