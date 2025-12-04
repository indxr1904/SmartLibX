// src/pages/admin/AddBookAssignment.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBookAssignment() {
  const [copyId, setCopyId] = useState("");
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [copycode, setCopyCode] = useState("");
  const [bookCopy, setBookCopy] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [librarianId, setLibrarianId] = useState("");
  const [librarianName, setLibrarianName] = useState("");
  const [error, setError] = useState("");
  const [errorCopy, setErrorCopy] = useState("");
  const [issueDate, setIssueDate] = useState(() => {
    // yyyy-mm-dd string for input[type=date]
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [dueDate, setDueDate] = useState("");
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // set librarian info from localStorage if present
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setLibrarianId(user._id || "");
      setLibrarianName(
        `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() ||
          user.name ||
          user.role ||
          ""
      );
    }

    // compute initial due date
    computeDueDate(issueDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    computeDueDate(issueDate);
  }, [issueDate]);

  function computeDueDate(issueDateStr) {
    if (!issueDateStr) {
      setDueDate("");
      return;
    }
    const d = new Date(issueDateStr);
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().slice(0, 10));
  }

  // search student by rollNo (POST to /users/studentdetail)
  const handleRollNoChange = async (e) => {
    const value = e.target.value;
    setRollNo(value);
    setStudent(null);
    setStudentId("");
    setError("");
    if (!value.trim()) return;

    try {
      setLoadingStudent(true);
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/users/studentdetail",
        { rollNo: value }
      );
      if (res?.data?.user) {
        setStudent(res.data.user);
        setStudentId(res.data.user._id);
      } else {
        setError("Roll No not found in the database");
      }
    } catch (err) {
      setError("Roll No not found in the database");
      console.error(err);
    } finally {
      setLoadingStudent(false);
    }
  };

  // search copycode and book details
  const handleCopycodeChange = async (e) => {
    const value = e.target.value;
    setCopyCode(value);
    setBookCopy(null);
    setBookDetails(null);
    setErrorCopy("");
    setCopyId("");
    setBookId("");
    if (!value.trim()) return;

    try {
      setLoadingCopy(true);
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/copies/bookdetails",
        { copycode: value }
      );
      if (res.data?.status === "success" && res.data.data) {
        const bc = res.data.data.bookCopies;
        const bd = res.data.data.bookDetails;

        // if copy already issued
        if (bc?.status === "issued") {
          setErrorCopy("Book is already assigned to a student");
          return;
        }

        setBookCopy(bc || null);
        setBookDetails(bd || null);
        setCopyId(bc?._id || "");
        setBookId(bd?._id || "");
      } else {
        setErrorCopy("Copy code not found");
      }
    } catch (err) {
      setErrorCopy("Copy code not found");
      console.error(err);
    } finally {
      setLoadingCopy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCopy("");
    setError("");

    if (!studentId) {
      setError("Please select a valid student (roll no).");
      return;
    }
    if (!copyId || !bookId) {
      setErrorCopy("Please provide a valid copy code.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        bookId,
        copyId,
        studentId,
        librarianId,
        issueDate: new Date(issueDate).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        status: "issued",
      };

      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/assignment",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.data?.status === "fail") {
        setErrorCopy(res.data.message || "Assignment failed");
        return;
      }

      // if API returns token (rare) keep it; otherwise don't overwrite
      if (res.data?.token) localStorage.setItem("token", res.data.token);

      // success: navigate back to assignments
      navigate("/admin/bookassignment");
    } catch (err) {
      console.error(err);
      setErrorCopy("Something went wrong while assigning the book");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Assign Book</h1>
        <p className="text-gray-600 mt-1">
          Fill in the details below to assign a new book to a student.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Assignment Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Librarian (readonly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Librarian
              </div>
              <input
                type="text"
                value={librarianName || librarianId}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </label>

            {/* Roll No input */}
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Enter Roll No
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 2021BCS001"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  onBlur={handleRollNoChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                {loadingStudent && (
                  <div className="absolute right-3 top-3 text-sm text-gray-500">
                    …
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </label>
          </div>

          {/* Student details read-only */}
          {student && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label>
                <div className="text-sm text-gray-600 mb-1">First Name</div>
                <input
                  readOnly
                  value={student.firstname}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Last Name</div>
                <input
                  readOnly
                  value={student.lastname}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <input
                  readOnly
                  value={student.email}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Copy Code */}
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Enter Copy Code
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. COPY-12345"
                  value={copycode}
                  onChange={(e) => setCopyCode(e.target.value)}
                  onBlur={handleCopycodeChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                {loadingCopy && (
                  <div className="absolute right-3 top-3 text-sm text-gray-500">
                    …
                  </div>
                )}
              </div>
              {errorCopy && (
                <p className="text-sm text-red-600 mt-1">{errorCopy}</p>
              )}
            </label>

            {/* Book ID (readonly) */}
            <label>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Book ID
              </div>
              <input
                readOnly
                value={bookCopy?.bookId ?? bookId}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </label>
          </div>

          {/* Book details when found */}
          {bookDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label>
                <div className="text-sm text-gray-600 mb-1">Title</div>
                <input
                  readOnly
                  value={bookDetails.title}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>

              <label>
                <div className="text-sm text-gray-600 mb-1">Author</div>
                <input
                  readOnly
                  value={bookDetails.author}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>

              <label>
                <div className="text-sm text-gray-600 mb-1">ISBN</div>
                <input
                  readOnly
                  value={bookDetails.isbn}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </label>
            </div>
          )}

          {/* Issue + Due dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </div>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </label>

            <label>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Due Date
              </div>
              <input
                type="date"
                value={dueDate}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </label>
          </div>

          {/* Status show */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Book Status
            </div>
            <input
              readOnly
              value={bookCopy?.status ?? "-"}
              className="w-48 px-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Error summary */}
          {(error || errorCopy) && (
            <div className="text-sm text-red-700">{error || errorCopy}</div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/bookassignment")}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Assign Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
