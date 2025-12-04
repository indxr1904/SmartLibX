import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://smartlibx.onrender.com/api/v1/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.data));

      const role = res.data.data.role;

      if (role === "student") navigate("/student");
      else if (role === "admin" || role === "librarian")
        navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed ❌");
    }
  };

  return (
    <div className="w-full   flex justify-center items-center mt-8 ">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden lg:block">
          <img
            src="/login.png"
            alt="Library"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Branding text */}
          <div className="absolute bottom-7 left-10 text-white">
            <h1 className="text-2xl font-bold">SmartLibX</h1>
            <p className="text-sm opacity-90">
              Your Digital Gateway to a World of Knowledge.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="flex items-center justify-center p-10 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex bg-gray-200 rounded-md overflow-hidden mb-8">
              <button className="flex-1 py-2 bg-white text-gray-700 font-medium border-r">
                Log In
              </button>
              <button
                className="flex-1 py-2 text-gray-500 hover:bg-gray-300 transition"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Welcome Back!
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="button"
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
