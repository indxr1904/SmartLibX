import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { FaPlus } from "react-icons/fa";

export default function UserManagement() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // paginated data
  const [search, setSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const handleAdd = () => navigate("/admin/adduser");
  const handleEdit = (id) => navigate(`/admin/edituser/${id}`);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch paginated users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/users/paginated?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
      );
      const data = await res.json();

      setProducts(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log("Error Fetching Users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Manage all registered user accounts in the library system.
        </p>
      </div>

      {/* SEARCH + ACTIONS */}
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-3 items-center text-center text-gray-400 text-lg">
            <FcSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on new search
            }}
          />
        </div>

        {/* Add User */}
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> Add New User
        </button>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">User Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4">Roll No.</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              products.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {user.firstname} {user.lastname}
                  </td>

                  <td className="p-4 text-gray-700">{user.email}</td>

                  <td className="p-4 capitalize">{user.role}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user?.verified ? "Active" : "Pending"}
                    </span>
                  </td>

                  <td className="p-4">{user.rollNo || "-"}</td>

                  <td className="p-4 flex gap-4 justify-center">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 text-lg"
                    >
                      <ImBin />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between text-sm text-gray-600 mt-4 px-1">
        <p>
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
          >
            ‹
          </button>

          {/* PAGE BUTTONS */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
