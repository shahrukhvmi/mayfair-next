import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const NextButton = ({ disabled, label, loading, onClick }) => {
    return (
        <div className="flex justify-center my-0 ms-2">
            <button
                disabled={disabled || loading}
                type="submit"
                onClick={onClick}
                className={`text-white px-9 py-2 rounded-md font-medium transition-all duration-150 ease-in
                    ${disabled || loading
                        ? "disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        : "bg-secondary hover:bg-secondary cursor-pointer"
                    }`}
            >
                {loading ? (
                    // Loading Spinner with Label
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span></span> {/* Added text */}
                    </div>
                ) : (
                    // Label with Icon
                    <span className="flex items-center text-sm whitespace-nowrap">
                        {label} 
                    </span>
                )}
            </button>
        </div>
    );
};

export default NextButton;
