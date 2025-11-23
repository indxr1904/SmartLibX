import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [rollNo, setRollNo] = useState("");

  const navigate = useNavigate();

  const roles = ["admin", "student", "librarian"];

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/users/signup", {
        firstname,
        lastname,
        email,
        password,
        passwordConfirm,
        role,
        rollNo,
      });

      alert("User created successfully ✔");
      navigate("/admin/usermanagement");
    } catch (err) {
      console.error(err);
      alert("Failed to create user ❌");
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
        <p className="text-gray-600">
          Fill in the details below to create a new user account.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
        <form onSubmit={handleSignup} className="space-y-8">
          {/* FIRST ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg border-gray-200 focus:ring-2 
                focus:ring-gray-300 outline-none bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg focus:ring-2 
                focus:ring-gray-300 outline-none bg-gray-50"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border  border-gray-200 rounded-lg focus:ring-2 
              focus:ring-gray-300 outline-none bg-gray-50"
              required
            />
          </div>

          {/* PASSWORDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg focus:ring-2 
                focus:ring-gray-300 outline-none bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg focus:ring-2 
                focus:ring-gray-300 outline-none bg-gray-50"
                required
              />
            </div>
          </div>

          {/* ROLE + ROLL NO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border  border-gray-200 rounded-lg bg-gray-50 focus:ring-2
                focus:ring-gray-300 outline-none"
                required
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r[0].toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {role === "student" ? (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Roll Number / ID
                </label>
                <input
                  type="text"
                  placeholder="Enter roll number or ID"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-4 py-3 border  border-gray-200 rounded-lg bg-gray-50 focus:ring-2 
                  focus:ring-gray-300 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Roll Number / ID
                </label>
                <input
                  disabled
                  placeholder="Not required"
                  className="w-full px-4 py-3 border  border-gray-200 rounded-lg bg-gray-100 text-gray-400"
                />
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/usermanagement")}
              className="px-6 py-3 rounded-lg border bg-gray-200  border-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
