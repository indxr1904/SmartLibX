import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const roles = ["admin", "student", "librarian"];

  /* Fetch user details */
  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/users/${id}`).then((res) => {
      const user = res.data.data.docs;
      setFirstName(user.firstname);
      setLastName(user.lastname);
      setEmail(user.email);
      setRole(user.role);
    });
  }, [id]);

  /* Update user */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/api/v1/users/${id}`, {
        firstname,
        lastname,
        email,
        role,
      });

      alert("User updated successfully 🎉");
      navigate("/admin/usermanagement");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
      <p className="text-gray-600 mt-1">
        Modify the user information and update their details.
      </p>

      {/* FORM WRAPPER */}
      <div className="mt-8 bg-white border  border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Row 1: First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-gray-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border  border-gray-200 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-gray-700 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border  border-gray-200 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-gray-300"
              required
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => navigate("/admin/usermanagement")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
