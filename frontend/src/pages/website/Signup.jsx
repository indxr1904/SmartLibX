import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");
  const [rollNo, setRollNo] = useState("");

  const navigate = useNavigate();

  const roles = ["admin", "student", "librarian"];

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/users/signup",
        {
          firstname,
          lastname,
          email,
          password,
          passwordConfirm,
          role,
          rollNo,
        }
      );

      if (res?.data?.status === "success") {
        alert("Signup successful! Please verify your email.");
        navigate("/login");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="w-full  flex justify-center  mt-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 min-h-[500px] mb-8">
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden lg:block">
          <img
            src="/login.png"
            alt="Library"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Branding */}
          <div className="absolute bottom-7 left-10 text-white">
            <h1 className="text-2xl font-bold">SmartLibX</h1>
            <p className="text-sm opacity-90">
              Your Digital Gateway to a World of Knowledge.
            </p>
          </div>
        </div>

        {/* RIGHT SIGNUP FORM */}
        <div className="flex items-center justify-center p-10 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex bg-gray-200 rounded-md overflow-hidden mb-8">
              <button
                className="flex-1 py-2 text-gray-500 hover:bg-gray-300 transition"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>

              <button className="flex-1 py-2 bg-white text-gray-700 font-medium border-l">
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Create an Account
            </h2>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Firstname */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Lastname */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* RollNo (only for students) */}
              {role === "student" && (
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Roll No
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Enter roll number"
                    className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
