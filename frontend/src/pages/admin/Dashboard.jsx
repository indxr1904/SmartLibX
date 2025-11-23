import { useEffect, useState } from "react";
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineClipboardDocument,
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserPlus,
  HiBookOpen,
} from "react-icons/hi2";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    overdueBooks: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fixed category list (option A)
  const categories = [
    "BCA",
    "CSE",
    "IT",
    "ELECTRONICS",
    "MECHANICAL",
    "CIVIL",
    "OTHERS",
  ];

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const [
        booksRes,
        membersRes,
        issuedRes,
        overdueRes,
        recentRes,
        categoryRes,
      ] = await Promise.all([
        fetch("http://localhost:3000/api/v1/dashboard/stats/books", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/v1/dashboard/stats/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/v1/dashboard/stats/issued", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/v1/dashboard/stats/overdue", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/v1/dashboard/assignments/recent", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/v1/dashboard/stats/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // defensive parsing
      const booksData = await safeJson(booksRes);
      const membersData = await safeJson(membersRes);
      const issuedData = await safeJson(issuedRes);
      const overdueData = await safeJson(overdueRes);
      const recentData = await safeJson(recentRes);
      const categoryData = await safeJson(categoryRes);

      setStats({
        totalBooks: booksData?.data?.total ?? 0,
        totalMembers: membersData?.data?.total ?? 0,
        issuedBooks: issuedData?.data?.count ?? 0,
        overdueBooks: overdueData?.data?.count ?? 0,
      });

      setRecentAssignments(recentData?.data?.collection ?? []);
      // categoryData expected as [{ _id: "CSE", count: 123 }, ...]
      const rawCats = categoryData?.data?.categories ?? [];

      // Map backend aggregation to our fixed categories list with counts and percent
      const totalCount = rawCats.reduce((s, c) => s + (c.count || 0), 0) || 1;
      const mapped = categories.map((cat) => {
        const found = rawCats.find(
          (r) => String(r._id || r.category || r.name).toUpperCase() === cat
        );
        const count = found?.count ?? 0;
        const percent = Math.round((count / totalCount) * 100);
        return { category: cat, count, percent };
      });

      setCategoryStats(mapped);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  // helper to parse optional JSON responses
  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="text-center py-10 text-gray-600">
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-center py-10 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* top: title + optional screenshot preview for dev */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your library's activity.
          </p>
        </div>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card
          title="Total Books"
          value={stats.totalBooks}
          icon={<HiOutlineBookOpen className="w-6 h-6" />}
          accent="bg-blue-50 text-blue-600"
        />
        <Card
          title="Total Members"
          value={stats.totalMembers}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          accent="bg-green-50 text-green-600"
        />
        <Card
          title="Books Checked Out"
          value={stats.issuedBooks}
          icon={<HiOutlineClipboardDocument className="w-6 h-6" />}
          accent="bg-indigo-50 text-indigo-600"
        />
        <Card
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={<HiOutlineExclamationCircle className="w-6 h-6" />}
          accent="bg-red-50 text-red-600"
          valueClassName="text-red-600"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionCard
            title="Add a New Book"
            icon={<HiPlusCircle className="w-6 h-6" />}
            onClick={() => (window.location.href = "/admin/addbook")}
            color="bg-green-50 text-green-600"
          />
          <ActionCard
            title="Register Member"
            icon={<HiUserPlus className="w-6 h-6" />}
            onClick={() => (window.location.href = "/admin/adduser")}
            color="bg-blue-50 text-blue-600"
          />
          <ActionCard
            title="Assign a Book"
            icon={<HiBookOpen className="w-6 h-6" />}
            onClick={() => (window.location.href = "/admin/addbookassignment")}
            color="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      {/* main content: recent assignments + categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Assignments</h3>

          <div className="overflow-auto">
            <table className="w-full text-left min-w-[640px] border-collapse">
              <thead>
                <tr
                  className="
            text-sm text-gray-700 
            bg-gray-100 
            rounded-t-lg
          "
                >
                  <th className="py-3 px-4 rounded-tl-lg">Member</th>
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Assigned</th>
                  <th className="py-3 px-4 rounded-tr-lg">Due</th>
                </tr>
              </thead>

              <tbody>
                {recentAssignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-500 border-b border-gray-200"
                    >
                      No recent assignments
                    </td>
                  </tr>
                ) : (
                  recentAssignments.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {item.studentId
                          ? `${item.studentId.firstname} ${item.studentId.lastname}`
                          : "-"}
                      </td>

                      <td className="py-3 px-4 text-blue-600">
                        {item.copyId?.bookId?.title || "-"}
                      </td>

                      <td className="py-3 px-4">
                        {item.issueDate
                          ? new Date(item.issueDate).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td className="py-3 px-4">
                        {item.issueDate
                          ? new Date(
                              new Date(item.issueDate).setDate(
                                new Date(item.issueDate).getDate() + 7
                              )
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Books by Category */}
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Books by Category</h3>

          {categoryStats.length === 0 ? (
            <div className="text-gray-500">No category data</div>
          ) : (
            categoryStats.map((c, index) => {
              // colors for each category
              const colors = [
                "bg-blue-600",
                "bg-green-600",
                "bg-purple-600",
                "bg-yellow-600",
                "bg-red-600",
                "bg-orange-600",
                "bg-teal-600",
              ];

              const barColor = colors[index % colors.length];

              return (
                <div key={c.category} className="mb-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>{c.category}</span>
                    <span className="font-medium">{c.count}</span>
                  </div>

                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${barColor}`}
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, accent = "", valueClassName = "" }) {
  return (
    <div className="flex items-start gap-4 bg-white p-5 rounded-lg border border-gray-200  hover:shadow-sm transition ">
      <div className={`p-3 rounded-lg ${accent}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`mt-1 text-2xl font-bold ${valueClassName}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  icon,
  onClick,
  color = "bg-gray-50 text-gray-600",
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition text-center"
    >
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div className="text-sm font-medium text-gray-800">{title}</div>
    </button>
  );
}
