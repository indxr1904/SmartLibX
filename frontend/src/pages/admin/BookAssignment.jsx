import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";

export default function BookAssignment() {
  const navigate = useNavigate();

  // data for current page
  const [assignments, setAssignments] = useState([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // filters / query
  const [rollNo, setRollNo] = useState("");
  const [dueDate, setDueDate] = useState(""); // yyyy-mm-dd from <input type="date">
  const [status, setStatus] = useState("");

  // pagination UI state
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // you can change default limit if needed
  const statusOptions = [
    { label: "None", value: "" },
    { label: "Issued", value: "issued" },
    { label: "Returned", value: "returned" },
    { label: "Overdue", value: "overdue" },
  ];

  // loading
  const [loading, setLoading] = useState(false);

  // fetch single page from backend
  const fetchPage = async (p = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("page", p);
      params.append("limit", limit);
      if (rollNo.trim()) params.append("rollNo", rollNo.trim());
      if (status) params.append("status", status);
      if (dueDate) {
        // convert yyyy-mm-dd -> dd/mm/yyyy for the backend (we used that earlier)
        const d = new Date(dueDate);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        params.append("dueDate", `${day}/${month}/${year}`);
      }

      const res = await fetch(
        `https://smartlibx.onrender.com/api/v1/assignment/assignments/paginated?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status} - ${txt}`);
      }

      const json = await res.json();

      // structure returned by backend controller:
      // data: { assignments, totalAssignments, totalPages, currentPage }
      const data = json.data || {};
      setAssignments(data.assignments || []);
      setTotalAssignments(data.totalAssignments || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || p);
    } catch (err) {
      console.error("fetchPage error:", err);
      // keep assignments as-is (UI shows empty if none)
    } finally {
      setLoading(false);
    }
  };

  // load first page on mount
  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters — resets to page 1
  const applyFilters = async () => {
    setPage(1);
    await fetchPage(1);
  };

  const clearFilters = async () => {
    // Reset filter UI values
    setRollNo("");
    setDueDate("");
    setStatus("");

    // Wait for state to update THEN call fetch without filters
    setTimeout(async () => {
      const token = localStorage.getItem("token");

      // Call backend WITHOUT ANY FILTERS
      const res = await fetch(
        `https://smartlibx.onrender.com/api/v1/assignment/assignments/paginated?page=1&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      const data = json.data || {};

      // Set clean data
      setAssignments(data.assignments || []);
      setTotalAssignments(data.totalAssignments || 0);
      setTotalPages(data.totalPages || 1);
      setPage(1);
    }, 0);
  };

  const handleAdd = () => navigate("/admin/addbookassignment");
  const handleEdit = (id) => navigate(`/admin/editassign/${id}`);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(
        `https://smartlibx.onrender.com/api/v1/assignment/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const json = await res.json();
      if (json.status === "success") {
        // refresh current page; if page becomes empty and page > 1, go to previous
        const remaining = totalAssignments - 1;
        const newTotalPages = Math.max(Math.ceil(remaining / limit), 1);
        const newPage = page > newTotalPages ? newTotalPages : page;
        await fetchPage(newPage);
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (err) {
      console.error("delete error:", err);
      alert("Error deleting assignment");
    }
  };

  // export currently shown page rows to excel (keeps your existing behaviour)
  const exportToExcel = () => {
    const dataToExport = assignments.map((item) => ({
      "Book Title": item.copyId?.bookId?.title || "",
      "Student Name": item.studentId
        ? `${item.studentId.firstname} ${item.studentId.lastname}`
        : "",
      "Librarian Name": item.librarianId
        ? `${item.librarianId.firstname} ${item.librarianId.lastname}`
        : "",
      "Issue Date": item.issueDate
        ? new Date(item.issueDate).toLocaleDateString("en-GB")
        : "",
      "Due Date": item.issueDate
        ? new Date(
            new Date(item.issueDate).setDate(
              new Date(item.issueDate).getDate() + 7
            )
          ).toLocaleDateString("en-GB")
        : "",
      "Return Date": item.returnDate
        ? new Date(item.returnDate).toLocaleDateString("en-GB")
        : "",
      Status: item.status || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileBlob, "BookAssignments.xlsx");
  };

  // helpers
  const fmt = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("en-GB");
    } catch {
      return "-";
    }
  };

  const statusBadge = (s) => {
    const lower = (s || "").toLowerCase();
    if (lower === "overdue")
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
          Overdue
        </span>
      );
    if (lower === "issued" || lower === "onloan" || lower === "on loan")
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
          Issued
        </span>
      );
    if (lower === "returned")
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
          Returned
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
        {s || "-"}
      </span>
    );
  };

  // pagination controls handlers
  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    fetchPage(p);
  };
  const prevPage = () => goToPage(Math.max(1, page - 1));
  const nextPage = () => goToPage(Math.min(totalPages, page + 1));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Book Assignment Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage the assignment of books to users.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto text-center"
        >
          + Assign New Book
        </button>
      </div>

      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <input
            type="text"
            placeholder="Search with RollNo"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="pl-3 pr-3 py-2 border border-gray-200 rounded-lg w-56 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="pl-3 pr-3 py-2 border border-gray-200 rounded-lg w-44 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg w-44 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={applyFilters}
            className="px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        <div className="w-full lg:w-auto">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full lg:w-auto"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm text-gray-600">
                Student Name
              </th>
              <th className="text-left p-4 text-sm text-gray-600">
                Book Title
              </th>
              <th className="text-left p-4 text-sm text-gray-600">Issued By</th>
              <th className="text-left p-4 text-sm text-gray-600">
                Assigned Date
              </th>
              <th className="text-left p-4 text-sm text-gray-600">Due Date</th>
              <th className="text-left p-4 text-sm text-gray-600">
                Return Date
              </th>
              <th className="text-left p-4 text-sm text-gray-600">Status</th>
              <th className="text-left p-4 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((row) => (
                <tr
                  key={row._id}
                  className="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td className="p-4">
                    {row.studentId
                      ? `${row.studentId.firstname} ${row.studentId.lastname}`
                      : "-"}
                  </td>

                  <td className="p-4">{row.copyId?.bookId?.title || "-"}</td>

                  <td className="p-4">{row.librarianId?.role || "-"}</td>

                  <td className="p-4">
                    {row.issueDate ? fmt(row.issueDate) : "-"}
                  </td>

                  <td className="p-4">
                    {row.issueDate
                      ? fmt(
                          new Date(
                            new Date(row.issueDate).setDate(
                              new Date(row.issueDate).getDate() + 7
                            )
                          ).toISOString()
                        )
                      : "-"}
                  </td>

                  <td className="p-4">
                    {row.returnDate ? fmt(row.returnDate) : "-"}
                  </td>

                  <td className="p-4">{statusBadge(row.status)}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(row._id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing page {page} of {totalPages} — {totalAssignments} assignments
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            &lt;
          </button>

          {/* simple page buttons: show up to 5 */}
          {Array.from({ length: totalPages })
            .slice(0, 10)
            .map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 border rounded ${
                    p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}

          <button
            onClick={nextPage}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
