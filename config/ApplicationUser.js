import React from "react";
import defaultLogo from "@/public/images/user.png";

const ApplicationUser = ({ logoUrl, ...props }) => {
  // If logoUrl is provided via props (e.g. from global context or props), use it
  const logoSrc = logoUrl || defaultLogo;

  return <img src={logoSrc} alt="Logo" {...props} />;
};

export default ApplicationUser;
