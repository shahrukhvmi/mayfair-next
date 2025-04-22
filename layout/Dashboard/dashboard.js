import React, { useState } from "react";
import Sidebar from "@/layout/Dashboard/sideBar";
import Navbar from "@/layout/Dashboard/navbar";

const Dashboard = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Replace this with useSelector if you hook into Redux
  const stockLoader = false;

  return (
    <div className="h-screen bg-[#f3f4f6] overflow-hidden">
      {stockLoader ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-rows-[auto_1fr] h-full">
          {/* Navbar */}
          <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className="grid sm:grid-cols-[auto_1fr] lg:grid-cols-[rem_1fr] 2xl:grid-cols-[31rem_1fr] h-full pt-5  overflow-hidden">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <main className="overflow-y-auto rounded-md px-2">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
