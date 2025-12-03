import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userData")); // must contain role

  // Auto navigate based on role when token exists
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin" || user.role === "librarian") {
        navigate("/admin/dashboard");
      } else if (user.role === "student") {
        navigate("/student");
      }
    }
  }, [token, user, navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <header className="w-full bg-white border-b shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-semibold text-gray-900">
              SmartLibX
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/features"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Features
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </Link>

            {/* When NOT logged in */}
            {!token ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* If admin or librarian */}
                {(user?.role === "admin" || user?.role === "librarian") && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Dashboard
                  </button>
                )}

                {/* If student */}
                {user?.role === "student" && (
                  <button
                    onClick={() => navigate("/student")}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Student Dashboard
                  </button>
                )}

                {/* Logout */}
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-gray-700 text-3xl"
            onClick={() => setOpenMenu(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* BACKDROP */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpenMenu(false)}
        ></div>
      )}

      {/* RIGHT-SIDE SLIDING MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end p-4">
          <button
            className="text-3xl text-gray-700"
            onClick={() => setOpenMenu(false)}
          >
            ✖
          </button>
        </div>

        {/* MENU LINKS */}
        <div className="flex flex-col px-6 gap-4">
          <Link
            to="/features"
            className="text-gray-700 text-lg font-medium hover:text-gray-900"
            onClick={() => setOpenMenu(false)}
          >
            Features
          </Link>

          <Link
            to="/about"
            className="text-gray-700 text-lg font-medium hover:text-gray-900"
            onClick={() => setOpenMenu(false)}
          >
            About
          </Link>

          {/* When NOT logged in */}
          {!token ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setOpenMenu(false);
                }}
                className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate("/signup");
                  setOpenMenu(false);
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {(user?.role === "admin" || user?.role === "librarian") && (
                <button
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setOpenMenu(false);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  Dashboard
                </button>
              )}

              {user?.role === "student" && (
                <button
                  onClick={() => {
                    navigate("/student");
                    setOpenMenu(false);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  Student Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  logoutHandler();
                  setOpenMenu(false);
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
