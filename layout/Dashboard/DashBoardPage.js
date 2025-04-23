import React from "react";
import Dashboard from "@/layout/Dashboard/dashboard";

const DashBoardPage = ({ children }) => {
  return <Dashboard>{children}</Dashboard>; // ✅ fix here
};

export default DashBoardPage;
