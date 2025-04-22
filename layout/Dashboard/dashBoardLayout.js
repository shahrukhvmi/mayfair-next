import React from "react";
import Dashboard from "@/layout/Dashboard/dashboard";

const DashBoardLayout = ({ children }) => {
  return <Dashboard>{children}</Dashboard>; // ✅ fix here
};

export default DashBoardLayout;
