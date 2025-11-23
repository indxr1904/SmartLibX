import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import menuConfig from "./../config/menuConfig.json";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.name || "User";
  const userRole = userData?.role || "student";

  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar state

  /* Highlight Active Menu (logic preserved) */
  useEffect(() => {
    const roleItems = menuConfig[userRole] || [];
    const active = roleItems.find((item) => item.route === location.pathname);
    if (active) setActiveItem(active.label);
  }, [location.pathname, userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    if (item.route) {
      setActiveItem(item.label);
      navigate(item.route);
      setIsOpen(false); // close mobile sidebar after click
    }
  };

  if (!token) return <Navigate to="/login" replace />;

  const roleMenu = menuConfig[userRole] || [];

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-800">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b z-30 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="font-semibold text-gray-800">SmartLibX</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="open menu"
            className="text-2xl text-gray-700"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* SIDEBAR (Desktop + Mobile Slider) */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between
          transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* SIDEBAR TOP */}
        <div>
          {/* BRAND */}
          <div className="px-6 py-5  flex items-center gap-3 lg:justify-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center text-white font-bold">
                <img
                  className="rounded-full"
                  src="/favicon.png"
                  alt="favicon"
                />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  SmartLibX
                </div>
                <div className="text-xs text-gray-500">Management</div>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              className="lg:hidden text-xl text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Menu */}
          <nav className="mt-4">
            {roleMenu.map((item) => (
              <div
                key={item.label}
                onClick={() => handleMenuClick(item)}
                className={`cursor-pointer px-6 py-3 text-sm flex items-center gap-3 transition
                  ${
                    activeItem === item.label
                      ? "bg-blue-50 text-blue-700 rounded-2xl ml-2.5 mr-2.5 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {/* icon (if item.icon is a class name, you can map it; here render a simple circle or svg) */}
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100">
                  {/* Use an inline svg for nicer icons — simplified placeholder */}
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M3 12h18M3 6h18M3 18h18"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>

                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="px-4 pb-6">
          <div className="border-t border-gray-200 mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left mt-2 px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-md"
            >
              <svg
                className="w-5 h-5 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M16 17l5-5-5-5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12H9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* DARK OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* MAIN */}
      <main className="flex-1 min-h-screen overflow-auto pt-20 lg:pt-0">
        {/* Top bar */}
        {/* TOP BAR — Desktop Only */}
        <div className="hidden lg:block sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-end items-center gap-4">
            {/* SEARCH BAR */}
            {/* <div className="flex-1">
              <div className="max-w-xl">
                <input
                  type="search"
                  placeholder="Search for books, members..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div> */}

            {/* RIGHT ICONS/ */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-semibold">
                  {userName[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{userName}</div>
                  <div className="text-xs text-gray-500">{userRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
