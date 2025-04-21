import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const Dashboard = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // const stockLoader = useSelector((state) => state.stockLoader.loading);
  const stockLoader = false;
  // useEffect(() => {}, []);

  // console.log(isStockKey);

  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-1 h-screen overflow-auto bg-[#f3f4f6]">
      {/* Navbar (full width) */}
      {stockLoader ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content Area */}
          <div className="grid sm:grid-cols-[auto_1fr] lg:grid-cols-[23rem_1fr] 2xl:grid-cols-[31rem_1fr] h-full pt-5 sm:pe-8">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="rounded-md">{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
