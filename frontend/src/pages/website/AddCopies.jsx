import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddCopies() {
  const { id } = useParams();
  const [bookId, setBookId] = useState(id);
  const [copycode, setCopyCode] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const handleAddCopy = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/copies/", {
        bookId,
        copycode,
        status,
      });

      alert("Book copy added successfully ✅");
      navigate(`/admin/bookcopies/${bookId}`);
    } catch (err) {
      console.error(err);
      alert("Copy not added ❌");
    }
  };

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900">Add Book Copy</h1>
      <p className="text-gray-600 mt-1">Add a new copy for this book.</p>

      {/* FORM CARD */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-3xl">
        <form onSubmit={handleAddCopy} className="space-y-6">
          {/* Book ID */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Book ID
            </label>
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none 
              focus:ring-2 focus:ring-gray-300"
              disabled
            />
          </div>

          {/* Copy Code */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Copy Code
            </label>
            <input
              type="text"
              value={copycode}
              onChange={(e) => setCopyCode(e.target.value)}
              placeholder="Enter copy code"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none 
              focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none 
              focus:ring-2 focus:ring-gray-300"
              required
            >
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* SAVE BUTTON */}
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
            hover:bg-blue-700 transition"
            >
              Add Copy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
