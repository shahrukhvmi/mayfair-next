import React, { useEffect, useState } from "react";
// import NextButton from "../NextBtn/NextButton";
import { Button } from "@mui/material";

const DosageCheckPopup = ({ text, onHandleConfirmation }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the fade-in effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className={`fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center p-4 overflow-y-auto
      ${isVisible ? "opacity-100" : "opacity-0"}
      ${isVisible ? "pointer-events-auto" : "pointer-events-none"}
      transition-opacity duration-500 backdrop-blur-sm bg-opacity-50`}
    >
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-6 text-center">
            <h1 className="mb-5 text-xl font-bold text-black my-3">Dosage Confirmation</h1>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{text}</h3>

            <button
              className="font-bold tracking-[1px] bg-violet-700 text-white rounded-md px-3 py-2 text-sm uppercase"
              onClick={onHandleConfirmation}
            >
              I confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageCheckPopup;
