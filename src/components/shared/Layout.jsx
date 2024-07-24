import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <div className="ml-60 flex flex-1 flex-col">
        <Navbar />
        <div className="flex justify-center overflow-auto px-4 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
