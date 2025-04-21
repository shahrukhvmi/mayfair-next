import React from "react";
import { FiX } from "react-icons/fi";
import { HiLocationMarker, HiOutlineLockClosed, HiShoppingBag, HiUser } from "react-icons/hi";
import { GiMedicines } from "react-icons/gi";
import ApplicationLogo from "@/config/ApplicationLogo";
import Link from "next/link";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`sm:m-5 sm:rounded-lg fixed top-0 left-0 lg:relative h-full w-100 md:w-100 bg-[#F9FAFB] py-4 px-3 flex flex-col shadow-md transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 sm:relative sm:translate-x-0 sm:w-100 md:w-100`}
    >
      <div className="flex justify-between p-1 mb-3 md:hidden">
        <div>
          {/* <img src="/logo.svg" alt="logo" width={150} /> */}
          <ApplicationLogo className="w-32 sm:w-40"  />

          
        </div>

        <div className="align-middle ms-2 pt-2 text-2xl text-[#7c3aed]" onClick={toggleSidebar}>
          <FiX size={30} />
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard/"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md tab-home ${isActive ? "bg-[#7c3aed] text-white active-tab" : "hover:bg-gray-200 text-[#111827] "}`
          }
          onClick={toggleSidebar}
        >
          {({ isActive }) => (
            <>
              <GiMedicines className={`text-2xl ${isActive ? "text-white" : "text-[#6b7280]"}`} />
              <span className="ml-3 sm:inline tab-text-home">My Account</span>
            </>
          )}
        </Link>

        <Link
          href="/orders/"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md tab-orders ${isActive ? "bg-[#7c3aed] text-white active-tab" : "hover:bg-gray-200 text-[#111827]"}`
          }
          onClick={toggleSidebar}
        >
          {({ isActive }) => (
            <>
              <HiShoppingBag className={`text-2xl ${isActive ? "text-white" : "text-[#6b7280]"}`} />
              <span className="ml-3 sm:inline tab-text-home">My Orders</span>
            </>
          )}
        </Link>

        <Link
          href="/profile/"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md  tab-profile ${isActive ? "bg-[#7c3aed] text-white active-tab" : "hover:bg-gray-200 text-[#111827]"}`
          }
          onClick={toggleSidebar}
        >
          {({ isActive }) => (
            <>
              <HiUser className={`text-2xl ${isActive ? "text-white" : "text-[#6b7280]"}`} />
              <span className="ml-3 sm:inline tab-text-home">My Profile</span>
            </>
          )}
        </Link>

        <Link
          href="/address/"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md  tab-address ${isActive ? "bg-[#7c3aed] text-white active-tab" : "hover:bg-gray-200 text-[#111827] "}`
          }
          onClick={toggleSidebar}
        >
          {({ isActive }) => (
            <>
              <HiLocationMarker className={`text-2xl ${isActive ? "text-white" : "text-[#6b7280]"}`} />
              <span className="ml-3 sm:inline tab-text-home">My Address Book</span>
            </>
          )}
        </Link>

        <Link
          href="/change-password/"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md  tab-password ${isActive ? "bg-[#7c3aed] text-white active-tab" : "hover:bg-gray-200 text-[#111827] "}`
          }
          onClick={toggleSidebar}
        >
          {({ isActive }) => (
            <>
              <HiOutlineLockClosed className={`text-2xl ${isActive ? "text-white" : "text-[#6b7280]"}`} />
              <span className="ml-3 sm:inline tab-text-home">Change Password</span>
            </>
          )}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
