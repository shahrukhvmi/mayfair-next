import React, { useEffect, useRef } from "react";
// import "../../../../css/modal.css";
import { useState } from "react";
import AbilityCheck from "../AbilityCheck/AbilityCheck";

const StartConsultationModal = ({ text, loading, closeModel, onHandleConfirm }) => {
  const modalRef = useRef(null);
  const [abilityState, setAbilityState] = useState(false); // Default to false
  const [PurchasingYourself, setPurchasingYourself] = useState(false); // Default to false

  // Function to update the ability state
  const handleAbilityChange = (isAble) => {
    setAbilityState(isAble);
    localStorage.setItem("ability", isAble);
    sessionStorage.setItem("ability", isAble);
  };

  const handlePurchasingYourself = (isAble) => {
    setPurchasingYourself(isAble);
    localStorage.setItem("PurchasingYourself", isAble);
    sessionStorage.setItem("PurchasingYourself", isAble);
  };

  // Add a class to apply the fade-in animation
  useEffect(() => {
    modalRef.current.classList.add("fade-in");
  }, []);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
    localStorage.setItem("ischecked", checked);
    sessionStorage.setItem("ischecked", checked);
    localStorage.setItem("reorder", false);
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center p-4 overflow-y-auto bg-black bg-opacity-50"
    >
      <div ref={modalRef} className="relative max-w-[900px] max-h-full">
        <div className="relative bg-white border-2 border-white rounded-lg shadow-lg">
          {" "}
          {/* Added border classes */}
          <button
            type="button"
            onClick={closeModel}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-3 sm:p-6 text-center w-full sm:max-w-[900px] max-h-full">
            <h1 className="justify-center mt-3 mb-2 text-xl font-semibold">Patient Acknowledgment</h1>

            <AbilityCheck
              onAbilityChange={handleAbilityChange}
              handleCheckboxChange={handleCheckboxChange}
              onPurchasingYourself={handlePurchasingYourself}
            />
            {/* , purchasing_yourself ,confirmation */}
            <button
              className="px-6 py-2 disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 border border-transparent rounded-md med-font text-xs text-white uppercase tracking-widest hover:bg-violet-700 focus:bg-bg-violet-700 active:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 transition ease-in-out duration-150"
              type="submit"
              onClick={onHandleConfirm}
              disabled={!abilityState || !PurchasingYourself || !isChecked || loading}
            >
              {loading ? (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-[#ffffff] rounded-full animate-spin"></div> {/* Spinner */}
                  </div>
                  <span className="opacity-0">Saving...</span>
                </div>
              ) : (
                "I Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConsultationModal;
