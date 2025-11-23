import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/commom/Header/index";
import Footer from "../components/commom/Footer/index";

export default function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Header />
      <main className="grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
