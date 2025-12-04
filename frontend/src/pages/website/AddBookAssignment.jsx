import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AssignBook() {
  const [copyId, setCopyId] = useState("");
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);

  const [copycode, setCopyCode] = useState("");
  const [bookCopy, setBookCopy] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);

  const [librarian, setLibrarian] = useState("");
  const [librarianId, setLibrarianId] = useState("");

  const [error, setError] = useState("");
  const [error1, setError1] = useState("");

  const [issueDate, setIssueDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const navigate = useNavigate();

  // Load librarian info + auto calculate due date
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user && user.role === "librarian") {
      setLibrarian(user.role);
      setLibrarianId(user._id);
    }

    const newDue = new Date(issueDate);
    newDue.setDate(issueDate.getDate() + 7);
    setDueDate(newDue);
  }, [issueDate]);

  // Fetch student by Roll No
  const handleRollNoChange = async (e) => {
    const value = e.target.value;
    setRollNo(value);
    setStudent(null);
    setError("");

    if (!value.trim()) return;

    try {
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/users/studentdetail",
        { rollNo: value }
      );
      setStudent(res.data.user);
      setStudentId(res.data.user._id);
    } catch (err) {
      setError("Roll No not found in the database", err);
    }
  };

  // Fetch book copy by copycode
  const handleCopycodeChange = async (e) => {
    const value = e.target.value;
    setCopyCode(value);
    setBookCopy(null);
    setBookDetails(null);
    setError1("");

    if (!value.trim()) return;

    try {
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/copies/bookdetails",
        { copycode: value }
      );

      if (res.data.status === "success") {
        if (res.data.data.bookCopies.status === "issued") {
          setError1("Book is already assigned to a student");
          return;
        }

        setBookCopy(res.data.data.bookCopies);
        setBookDetails(res.data.data.bookDetails);
        setCopyId(res.data.data.bookCopies._id);
        setBookId(res.data.data.bookDetails._id);
      } else {
        setError1("Copycode not found");
      }
    } catch (err) {
      setError1("CopyCode not found", err);
    }
  };

  // Submit Assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError1("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/assignment",
        {
          bookId,
          copyId,
          studentId,
          librarianId,
          issueDate,
          dueDate,
          status: "issued",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "fail") {
        setError1(res.data.message);
        return;
      }

      navigate("/admin/bookassignment");
    } catch (err) {
      setError1("Something went wrong while assigning the book", err);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Assign Book</h1>
      <p className="text-gray-600 mb-6">
        Fill in the details below to assign a new book to a student.
      </p>

      {/* MAIN CARD */}
      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 max-w-4xl mx-auto border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Assignment Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Librarian */}
          <div>
            <label className="text-sm text-gray-700">Librarian</label>
            <input
              value={librarian}
              readOnly
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Roll No */}
          <div>
            <label className="text-sm text-gray-700">Enter Roll No</label>
            <input
              value={rollNo}
              onChange={handleRollNoChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Student Details */}
          {student && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700">First Name</label>
                <input
                  value={student.firstname}
                  readOnly
                  className="w-full mt-1 border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Last Name</label>
                <input
                  value={student.lastname}
                  readOnly
                  className="w-full mt-1 border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  value={student.email}
                  readOnly
                  className="w-full mt-1 border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Copy Code */}
          <div>
            <label className="text-sm text-gray-700">Enter Copy Code</label>
            <input
              value={copycode}
              onChange={handleCopycodeChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            {error1 && <p className="text-red-600 text-sm mt-1">{error1}</p>}
          </div>

          {/* Book Details */}
          {bookCopy && bookDetails && !error1 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Book ID</label>
                  <input
                    value={bookCopy.bookId}
                    readOnly
                    className="w-full mt-1 border bg-gray-100 border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Copy Status</label>
                  <input
                    value={bookCopy.status}
                    readOnly
                    className="w-full mt-1 border bg-gray-100 border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Title</label>
                  <input
                    value={bookDetails.title}
                    readOnly
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Author</label>
                  <input
                    value={bookDetails.author}
                    readOnly
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">ISBN</label>
                  <input
                    value={bookDetails.isbn}
                    readOnly
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Category</label>
                <input
                  value={bookDetails.category}
                  readOnly
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Issue + Due Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate.toISOString().substring(0, 10)}
                    onChange={(e) => setIssueDate(new Date(e.target.value))}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    value={dueDate.toISOString().substring(0, 10)}
                    readOnly
                    className="w-full mt-1 border bg-gray-100 border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Book Issued</label>
                <input
                  value="issued"
                  readOnly
                  className="w-full mt-1 border bg-gray-100 border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
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
              Assign Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
