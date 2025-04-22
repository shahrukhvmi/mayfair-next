import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiCross } from "react-icons/bi";
import { BsCrosshair2 } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { FaCross } from "react-icons/fa6";
import { RxCross1, RxCross2 } from "react-icons/rx";

const AbilityCheck = ({ onAbilityChange, handleCheckboxChange, onPurchasingYourself }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      ability: "",
      confirmation: "",
      purchasing_yourself: "",
    },
  });

  const [initVal, setInitVal] = useState({ checked: false });

  const ability = watch("ability");
  const purchasingYourself = watch("purchasing_yourself");

  const onSubmit = (data) => {};

  const handleAbilityChange = (value) => {
    setValue("ability", value);
    setValue("confirmation", ""); // Reset confirmation when ability changes
    onAbilityChange(value === "yes");
  };

  const handlePurchasingYourselfChange = (value) => {
    setValue("purchasing_yourself", value);
    setValue("confirmation", "");
    onPurchasingYourself(value === "yes");
  };

  const handleCheckboxLocalChange = (e) => {
    const checked = e.target.checked;
    setInitVal((prev) => ({ ...prev, checked })); // Update the local state with the new checked value
    if (handleCheckboxChange) {
      handleCheckboxChange(checked); // If the parent has a handler, call it
    }
  };

  const termsData = [
    "You consent for your medical information to be assessed by the clinical team at Mayfair Weight Loss Clinic and its pharmacy and to be prescribed medication.",
    "You consent to an age and ID check when placing your first order.",
    "You will answer all questions honestly and accurately, and understand that it is an offence to provide false information.",
    "You have capacity to understand all about the condition and medication information we have provided and that you give fully informed consent to the treatment option provided.",
    "You understand that the treatment or medical advice provided is based on the information you have provided.",
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="figtree-reg">
      {/* Purchasing Yourself Section */}
      <div className="field border rounded-md p-3 mb-3 flex flex-col lg:flex-row justify-between items-center sm:items-start gap-5 lg:gap-10">
        <p className="text-sm leading-5 text-black my-auto text-left">
          Are you purchasing this medication for yourself, of your own free will and the medicine is for your personal use only?
        </p>

        <div className="flex gap-4">
          <label
            className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
              touchedFields.purchasing_yourself && errors.purchasing_yourself
                ? "border-red-500"
                : purchasingYourself === "yes"
                ? "border-[#4DB581] bg-green-50"
                : "border-gray-300 bg-white"
            }`}
            onClick={() => handlePurchasingYourselfChange("yes")}
          >
            <div className="flex items-center">
              <span className={`text-sm font-semibold uppercase ${purchasingYourself === "yes" ? "text-[#4DB581]" : "text-gray-500"}`}>Yes</span>
              {purchasingYourself === "yes" && (
                <FaCheck color="#4DB581" className="ml-5" size={14} /> // Adds some space between the text and icon
              )}
            </div>
            <input type="radio" value="yes" {...register("purchasing_yourself")} className="hidden" />
          </label>

          <label
            className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
              touchedFields.purchasing_yourself && errors.purchasing_yourself
                ? "border-red-500"
                : purchasingYourself === "no"
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            onClick={() => handlePurchasingYourselfChange("no")}
          >
            <div className="flex items-center">
              <span className={`text-sm font-semibold uppercase ${purchasingYourself === "no" ? "text-red-700" : "text-gray-500"}`}>No</span>
              {purchasingYourself === "no" && (
                <RxCross2 color="red" className="ml-5 font-semibold" size={20} /> // Adds some space between the text and icon
              )}
            </div>
            <input type="radio" value="no" {...register("purchasing_yourself")} className="hidden" />
          </label>
        </div>
      </div>

      {/* Ability Section */}
      <div className="field border rounded-md p-3 mb-3 flex flex-col lg:flex-row justify-between items-start sm:items-start gap-5 lg:gap-10">
        <p className="text-sm leading-5 text-black my-auto text-start">
          Do you believe you have the ability to make healthcare decisions for yourself?
        </p>

        <div className="flex gap-4">
          <label
            className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
              touchedFields.ability && errors.ability
                ? "border-red-500"
                : ability === "yes"
                ? "border-[#4DB581] bg-green-50"
                : "border-gray-300 bg-white"
            }`}
            onClick={() => handleAbilityChange("yes")}
          >
            <div className="flex items-center">
              <span className={`text-sm font-semibold uppercase ${ability === "yes" ? "text-[#4DB581]" : "text-gray-500"}`}>Yes</span>
              {ability === "yes" && (
                <FaCheck color="#4DB581" className="ml-5" size={14} /> // Adds some space between the text and icon
              )}
            </div>
            <input type="radio" value="yes" {...register("ability")} className="hidden" />
          </label>

          <label
            className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
              touchedFields.ability && errors.ability ? "border-red-500" : ability === "no" ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
            }`}
            onClick={() => handleAbilityChange("no")}
          >
            {/* <span className={`text-sm font-semibold uppercase ${ability === "no" ? "text-red-700" : "text-gray-500"}`}>
                            No
                        </span> */}

            <div className="flex items-center">
              <span className={`text-sm font-semibold uppercase ${ability === "no" ? "text-red-700" : "text-gray-500"}`}>No</span>
              {ability === "no" && (
                <RxCross2 color="red" className="ml-5 font-semibold" size={20} /> // Adds some space between the text and icon
              )}
            </div>
            <input type="radio" value="no" {...register("ability")} className="hidden" />
          </label>
        </div>
      </div>

      <div
        className={`bg-white shadow-sm rounded-md  w-full my-3 ${
          ability === "yes" && purchasingYourself === "yes" ? "border-white" : "border-gray-400 filter blur-sm"
        }`}
      >
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            {/* Custom Checkbox */}
            <div className="relative">
              <input
                type="checkbox"
                name="confirmation"
                checked={initVal.checked} // This controls the checkbox (always either true or false)
                onChange={handleCheckboxLocalChange} // Update the local state when changed
                id="confirmation"
                className="hidden" // Hide the default checkbox input
              />
              <div
                className={`mt-1 w-5 h-5 border-2 rounded-full ${
                  initVal.checked ? "bg-violet-600 border-violet-600 p-1" : "bg-white border-gray-400"
                } transition duration-300`}
              >
                {initVal.checked && (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCheck color="#fff" /> {/* Show check icon when checked */}
                  </div>
                )}
              </div>
            </div>
            <span className="figtree-reg text-sm text-black mt-1">Do you confirm that:</span>
          </label>

          <div
            className={`my-4 space-y-2 ${
              ability !== "yes" ? "disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-none" : ""
            }`}
          ></div>

          <div>
            <ul
              className={`list-disc list-inside text-sm space-y-1 pl-6 text-left ${
                ability !== "yes" || purchasingYourself !== "yes" ? "text-gray-500 cursor-not-allowed" : ""
              }`}
            >
              {termsData.map((term, index) => (
                <li
                  key={index}
                  className={`text-black font-sm  figtree-reg ${
                    ability !== "yes" || purchasingYourself !== "yes" ? "text-gray-400 filter blur-sm" : ""
                  }`}
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AbilityCheck;
