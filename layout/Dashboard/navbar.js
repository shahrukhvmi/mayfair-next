import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ApplicationLogo from "@/config/ApplicationLogo";
import ApplicationUser from "@/config/ApplicationUser";
// import { useProfileUserDataQuery } from "../../store/services/Dashboard/dashboardApi";
import Link from "next/link";

const Navbar = ({ isOpen, toggleSidebar }) => {
  const [isOpenDrop, setIsOpenDrop] = useState(false);

  const [name, setUserData] = useState("");

  // RTk Query Fetch user /GetUserData 🔥🔥
  // const { data } = useProfileUserDataQuery();
  const data = [];
  useEffect(() => {
    if (data) {
      const userName = data.profile?.user ?? "";
      setUserData(userName);
    }
  }, [data]);


  const toggleDropdown = () => {
    setIsOpenDrop((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownMenu = document.querySelector(".dropdown-menu");
      if (dropdownMenu && !dropdownMenu.contains(event.target)) {
        setIsOpenDrop(false);
      }
    };

    if (isOpenDrop) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDrop]);
  const handleLogout = () => {
    setIsOpenDrop(false); // Close the dropdown
    logout();

  };
  const handleRemovePid = () => {
    localStorage.removeItem("previous_id")
  }
  const [impersonat, setImpersonat] = useState(null);

  useEffect(() => {
    const impersonateEmail = localStorage.getItem("impersonate_email");
    setImpersonat(impersonateEmail);
  }, []);

  const handleRemovedImpersonate = () => {
    setImpersonat(null);
    logout();

  };
  return (

    <>
      {impersonat && (
        <div className="bg-gray-100">
          <div className="bg-red-500 text-white text-center p-2 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-xl"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H8v-1.5c0-1.99 4-3 6-3s6 1.01 6 3V16z"></path>
              </svg>
              <span>You are impersonating another user.</span>
            </div>

            <button
              className="ml-0 sm:ml-2 underline flex items-center gap-1 text-xs sm:text-sm"
              onClick={handleRemovedImpersonate}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-xl"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H8v-1.5c0-1.99 4-3 6-3s6 1.01 6 3V16z"></path>
              </svg>
              <span>Stop Impersonation</span>
            </button>
          </div>
        </div>
      )}


      <div className="bg-white px-4 sm:px-6 lg:px-6 flex items-center justify-between relative">
        {/* Hamburger Button (only visible on mobile) */}
        <button onClick={toggleSidebar} className="text-2xl text-violet-700 sm:hidden">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <div className="w-32 sm:w-40">
          <Link href="/dashboard/" onClick={handleRemovePid}>
            {/* <img src="/logo.svg" className="w-32 sm:w-40" alt="Logo" /> */}
            <ApplicationLogo className="w-32 sm:w-40" />
          </Link>
        </div>

        {/* User Info */}
        <div className="relative">
          {/* Dropdown Trigger */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
            {/* <img src="/images/user.png" alt="User Avatar" className="w-10 h-10 rounded-full" /> */}
            <ApplicationUser className="w-10 h-10 rounded-full" />
            <span className="reg-font text-[#1C1C29] truncate">{name && name.fname && name.lname ? `${name.fname} ${name.lname}` : ""}</span>
          </div>

          {/* Dropdown Menu */}
          {isOpenDrop && (
            <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <ul className="py-1">
                <li className="ligt-font px-4 py-2 text-[#1C1C29] hover:bg-gray-100 cursor-pointer">
                  <Link href="/dashboard/" onClick={toggleDropdown}>My Account</Link>
                </li>
                <li className="ligt-font px-4 py-2 text-[#1C1C29] hover:bg-gray-100 cursor-pointer">
                  <Link href="/profile/" onClick={toggleDropdown}>
                    My Profile
                  </Link>
                </li>
                <li className="reg-font px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
