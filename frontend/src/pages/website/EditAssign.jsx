import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAssign() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    copyId: "",
    studentId: "",
    student: null,
    librarian: "",
    librarianId: "",
    rollNo: "",
    copycode: "",
    issueDate: new Date(),
    dueDate: new Date(),
    returnDate: "",
    status: "issued",
    bookCopy: null,
  });

  const navigate = useNavigate();

  // FETCH EXISTING ASSIGNMENT
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));

    axios
      .get(`http://localhost:3000/api/v1/assignment/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const data = res.data.data.collection[0];
        if (!data) return;

        const derivedDue = new Date(data.issueDate);
        derivedDue.setDate(derivedDue.getDate() + 7);

        setFormData({
          copyId: data.copyId?._id || "",
          studentId: data.studentId?._id || "",
          rollNo: data.studentId?.rollNo || "",
          student: data.studentId,
          copycode: data.copyId?.copycode || "",
          bookCopy: data.copyId || null,
          librarian: data.librarianId?.role || user?.role || "",
          librarianId: data.librarianId?._id || user?._id || "",
          issueDate: new Date(data.issueDate),
          dueDate: derivedDue,
          returnDate: data.returnDate ? data.returnDate.split("T")[0] : "",
          status: data.status || "issued",
        });
      })
      .catch((err) => console.error("Error loading assignment:", err));
  }, [id]);

  // HANDLE INPUT CHANGE
  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/assignment/${id}`,
        {
          status: formData.status,
          returnDate: formData.returnDate || null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Assignment updated successfully!");
      navigate("/admin/bookassignment");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Update Assignment
      </h1>
      <p className="text-gray-600 mb-6">Modify assignment details.</p>

      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 max-w-4xl mx-auto border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Assignment Details
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* LIBRARIAN */}
          <div>
            <label className="text-sm text-gray-700">Librarian</label>
            <input
              readOnly
              value={formData.librarian}
              className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* ROLL NO */}
          <div>
            <label className="text-sm text-gray-700">Roll No</label>
            <input
              readOnly
              value={formData.rollNo}
              className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* STUDENT DETAILS */}
          {formData.student && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700">First Name</label>
                <input
                  readOnly
                  value={formData.student.firstname}
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Last Name</label>
                <input
                  readOnly
                  value={formData.student.lastname}
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  readOnly
                  value={formData.student.email}
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* COPY CODE */}
          <div>
            <label className="text-sm text-gray-700">Copy Code</label>
            <input
              readOnly
              value={formData.copycode}
              className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* BOOK DETAILS */}
          {formData.bookCopy && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Book ID</label>
                  <input
                    readOnly
                    value={formData.bookCopy.bookId?._id}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Status</label>
                  <input
                    readOnly
                    value={formData.status}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Title</label>
                <input
                  readOnly
                  value={formData.bookCopy.bookId?.title}
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Author</label>
                  <input
                    readOnly
                    value={formData.bookCopy.bookId?.author}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">ISBN</label>
                  <input
                    readOnly
                    value={formData.bookCopy.bookId?.isbn}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Category</label>
                  <input
                    readOnly
                    value={formData.bookCopy.bookId?.category}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Issue Date</label>
                  <input
                    type="date"
                    readOnly
                    value={formData.issueDate.toISOString().substring(0, 10)}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Due Date</label>
                  <input
                    type="date"
                    readOnly
                    value={formData.dueDate.toISOString().substring(0, 10)}
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm text-gray-700">Update Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="issued">Issued</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* RETURN DATE */}
              <div>
                <label className="text-sm text-gray-700">Return Date</label>
                <input
                  type="date"
                  value={formData.returnDate || ""}
                  onChange={(e) => updateField("returnDate", e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                />
              </div>
            </>
          )}

          {/* SUBMIT */}
          <div className="pt-4 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/admin/bookassignment`)}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              Update Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
