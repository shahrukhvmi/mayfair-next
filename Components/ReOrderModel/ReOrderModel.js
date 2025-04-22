import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaCheck } from "react-icons/fa";

const ReOrderModel = ({ closeModel, onHandleConfirm, loading }) => {
  const modalRef = useRef(null);
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [isNoSelected, setIsNoSelected] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      confirm: "",
    },
  });

  // Update localStorage when the selection changes
  useEffect(() => {
    if (isYesSelected) {
      localStorage.setItem("reorder_concent", true);
    } else if (isNoSelected) {
      localStorage.setItem("reorder_concent", false);
    }
  }, [isYesSelected, isNoSelected]);

  const handleYesSelection = () => {
    
    setValue("confirm", "yes");
    setIsYesSelected(true);
    setIsNoSelected(false);
  };

  const handleNoSelection = () => {
    setValue("confirm", "no");
    setIsYesSelected(false);
    setIsNoSelected(true);
  };

  const onSubmit = (data) => {
    const isConfirmed = data.confirm === "yes";

    // Notify parent component
    onHandleConfirm(isConfirmed);

    const message = isConfirmed
      ? "You have confirmed to make changes to the reorder."
      : "You have chosen not to make changes to the reorder.";
    localStorage.setItem("reorder-message", message);

  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center p-4 overflow-y-auto bg-black bg-opacity-50"
    >
      <div ref={modalRef} className="relative max-w-[900px] max-h-full">
        <div className="relative bg-white border-2 border-white rounded-lg shadow-lg p-6">
          <button
            type="button"
            onClick={closeModel}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <h1 className="justify-center my-3 text-xl font-semibold text-center">
            Reorder Confirmation
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field border rounded-md p-3 mb-3 flex flex-col lg:flex-row justify-between sm:items-start items-center gap-5 lg:gap-10">
              <p className="text-sm leading-5 text-[#1C1C29] my-auto">
                Has anything changed since your last order?
              </p>

              <div className="flex gap-4">
                {/* Yes Option */}
                <Controller
                  name="confirm"
                  control={control}
                  rules={{ required: "You must select either Yes or No" }}
                  render={({ field }) => (
                    <label
                      htmlFor="confirmYes"
                      className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
                        field.value === "yes"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={handleYesSelection}
                    >
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-semibold uppercase ${
                            field.value === "yes"
                              ? "text-[#4DB581]"
                              : "text-gray-500"
                          }`}
                        >
                          Yes
                        </span>
                        {field.value === "yes" && (
                          <FaCheck color="#4DB581" className="ml-5" size={14} />
                        )}
                      </div>
                      <input
                        type="radio"
                        id="confirmYes"
                        value="yes"
                        {...field}
                        className="hidden"
                      />
                    </label>
                  )}
                />

                {/* No Option */}
                <Controller
                  name="confirm"
                  control={control}
                  rules={{ required: "You must select either Yes or No" }}
                  render={({ field }) => (
                    <label
                      htmlFor="confirmNo"
                      className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
                        field.value === "no"
                          ? "border-violet-700 bg-violet-200"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={handleNoSelection}
                    >
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-semibold uppercase ${
                            field.value === "no"
                              ? "text-violet-700"
                              : "text-gray-500"
                          }`}
                        >
                          No
                        </span>
                        {field.value === "no" && (
                          <FaCheck
                            color="#4565BF"
                            className="ml-5"
                            size={14}
                          />
                        )}
                      </div>
                      <input
                        type="radio"
                        id="confirmNo"
                        value="no"
                        {...field}
                        className="hidden"
                      />
                    </label>
                  )}
                />
              </div>
            </div>

            {errors.confirm && (
              <div className="text-red-500 text-sm mt-2">
                {errors.confirm.message}
              </div>
            )}

            <div className="flex justify-center">
              <button
                className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-violet-700 border border-transparent rounded-md text-xs text-white uppercase tracking-widest hover:bg-violet-700 transition ease-in-out duration-150"
                type="submit"
                disabled={!isValid || loading}
              >
                {loading ? (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-[#ffffff] rounded-full animate-spin"></div>
                    </div>
                    <span className="opacity-0">Saving...</span>
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReOrderModel;
