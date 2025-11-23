import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("userData"));
    if (!student) return;

    const studentId = student._id;

    fetch("http://localhost:3000/api/v1/assignment", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const all = result.data?.collection || [];

        // Show ONLY assignments where studentId matches
        const filtered = all.filter(
          (item) => item.studentId?._id === studentId
        );

        setAssignments(filtered);
      })
      .catch((err) => console.log(err));
  }, []);

  const fmt = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const statusBadge = (s) => {
    const lower = (s || "").toLowerCase();

    if (lower === "overdue")
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
          Overdue
        </span>
      );

    if (lower === "issued")
      return (
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
          Issued
        </span>
      );

    if (lower === "returned")
      return (
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          Returned
        </span>
      );

    return (
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
        {s || "-"}
      </span>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900">My Assigned Books</h1>
      <p className="text-gray-600 mt-1">
        View books issued to you and their return status.
      </p>

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-md overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 text-left text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Book Title</th>
              <th className="p-4 font-semibold">Issued By</th>
              <th className="p-4 font-semibold">Issue Date</th>
              <th className="p-4 font-semibold">Due Date</th>
              <th className="p-4 font-semibold">Return Date</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 text-sm"
                >
                  No assigned books yet.
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr
                  key={a._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4">{a.copyId?.bookId?.title || "-"}</td>

                  <td className="p-4">
                    {a.librarianId
                      ? `${a.librarianId.firstname} ${a.librarianId.lastname}`
                      : "-"}
                  </td>

                  <td className="p-4">{fmt(a.issueDate)}</td>

                  <td className="p-4">
                    {a.issueDate
                      ? fmt(
                          new Date(
                            new Date(a.issueDate).setDate(
                              new Date(a.issueDate).getDate() + 7
                            )
                          )
                        )
                      : "-"}
                  </td>

                  <td className="p-4">{fmt(a.returnDate)}</td>

                  <td className="p-4">{statusBadge(a.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
