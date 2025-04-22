import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ label, onClick }) => {
  return (
    <div className="flex justify-center my-0 ms-2">
      <button
        onClick={onClick}
        type="button" // Set type to "button" for navigation
        className="border border-secondary text-secondary px-8 py-2 rounded-md font-medium transition-all duration-150 ease-in cursor-pointer"
      >
        <span className="flex items-center ">
          {label} {/* Button Label */}
        </span>
      </button>
    </div>
  );
};

export default BackButton;
