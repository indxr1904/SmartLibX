import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import Layout from "./Layouts/Layout";
import Login from "./pages/website/Login";
import Signup from "./pages/website/Signup";
import Home from "./pages/website/Home";

import AdminLayout from "./Layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AddUser from "./pages/website/AddUser";
import UserManagement from "./pages/admin/UserManagement";
import EditUser from "./pages/website/EditUser";
import BookManagement from "./pages/admin/BookManagement";
import AddBook from "./pages/website/AddBook";
import EditBook from "./pages/website/EditBook";
import BookCopies from "./pages/admin/BookCopies";
import AppCopies from "./pages/website/AddCopies";
import EditCopy from "./pages/website/EditCopy";
import BookAssignment from "./pages/admin/BookAssignment";
import AddBookAssignment from "./pages/website/AddBookAssignment";
import EditAssign from "./pages/website/EditAssign";
import StudentDashboard from "./pages/student/StudentDashboard";
import About from "./pages/website/About";
import Features from "./pages/website/Features";

import ProtectedRoute from "../src/components/commom/ProtectedRoute";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          { path: "about", element: <About /> },
          { path: "features", element: <Features /> },
        ],
      },

      {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["admin", "librarian"]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "usermanagement", element: <UserManagement /> },
              { path: "adduser", element: <AddUser /> },
              { path: "edituser/:id", element: <EditUser /> },
              { path: "bookmanagement", element: <BookManagement /> },
              { path: "addbook", element: <AddBook /> },
              { path: "editbook/:id", element: <EditBook /> },
              { path: "bookcopies/:id", element: <BookCopies /> },
              { path: "addcopies/:id", element: <AppCopies /> },
              { path: "editcopy/:id", element: <EditCopy /> },
              { path: "bookassignment", element: <BookAssignment /> },
              { path: "addbookassignment", element: <AddBookAssignment /> },
              { path: "editassign/:id", element: <EditAssign /> },
            ],
          },
        ],
      },

      {
        path: "/student",
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [{ index: true, element: <StudentDashboard /> }],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
