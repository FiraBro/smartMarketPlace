import React, { useState } from "react";
import SellerSidebar from "../components/seller/SellerSideBar";
import SellerNavbar from "../components/seller/SellerNavbar";

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SellerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto lg:ml-auto">
        <SellerNavbar toggleSidebar={toggleSidebar} />
        <div className="sm:p-6 md:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
