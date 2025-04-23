import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaMinus, FaPlus, FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ConfirmationModal from "../Modal/ConfirmationModal";
import moment from "moment/moment";
import { HiOutlineTrash } from "react-icons/hi";
// import { useInStockNotifiedMutation } from "../../store/services/Dashboard/dashboardApi";
const Dose = ({
  id,
  doseData,
  allowed,
  onIncrement,
  onDecrement,
  totalSelectedQty,
  isSelected,
  onSelect,
  productName,
  onClick,
  handleRemoveItem,
  removeSeleted,
  setRemoveSelected,
  setVariations,
  handleSelect,
  handleVariationClick,
  index,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const doseStatus = doseData?.stock?.status === 1 && doseData?.stock?.quantity > 1 ? 1 : 0;
  const handleDeleteClick = (dose) => {
    setItemToRemove(dose);
    setShowModal(true);
  };
  // const [getInStockNotified, { isLoading, error }] = useInStockNotifiedMutation();
  // const handleNotifiedClick = async (dose) => {
  //   try {
  //     const response = await getInStockNotified({
  //       eid: dose.pivot?.eid,
  //       pid: dose.pivot?.pid,
  //     }).unwrap();
  //     if (response?.status === true) {
  //       toast.success(response?.message);
  //     } else {
  //       toast.error(response?.errors);
  //     }
  //   } catch (err) {
  //     toast.error(err?.data?.errors?.Notification);
  //     console.log(err);
  //   }
  // };
  const handleConfirmRemove = () => {
    if (!itemToRemove) return;
    const removeitem = removeSeleted.filter((item) => item.id === itemToRemove.id);
    if (removeitem.length > 0) {
      handleSelect(removeitem[0].e, removeitem[0].id);
      setRemoveSelected(removeSeleted.filter((item) => item.id !== itemToRemove.id));
    } else {
      setVariations((prev) => prev.map((variation) => (variation.id === itemToRemove.id ? { ...variation, isSelected: false } : variation)));
    }
    handleRemoveItem(itemToRemove.id, itemToRemove.id);
    setShowModal(false); // Close the modal
  };
  const handleCancelRemove = () => {
    setShowModal(false);
  };
  const handleIncrement = (e) => {
    e.stopPropagation();
    const totalQty = totalSelectedQty + 1;
    if (totalQty > allowed) {
      toast.error(`You can only select up to ${allowed} units in total.`);
    } else if (doseData.qty >= doseData.stock.quantity) {
      toast.error(`Only ${doseData.stock.quantity} units are available.`);
    } else {
      onIncrement(id);
    }
  };
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (doseData.qty > 1) {
      onDecrement(id);
    }
  };
  const handleSelected = (e) => {
    e.stopPropagation();
    onSelect(e);
    handleVariationClick && handleVariationClick(doseData?.name, index);
  };
  return (
    <>
      <div className="flex flex-col items-center" onClick={handleSelect}>
        {/* Main Card */}
        <div
          onClick={(e) => {
            if (doseStatus === 0) return;
            onClick(e);
            handleSelected(e);
          }}
          className={`w-full sm:w-48 overflow-hidden variations pt-8 pb-3 px-2 relative bg-white text-center rounded-tl-md rounded-tr-md duration-300 border-2
            ${
              doseStatus === 0
                ? "border-gray-300 opacity-50 cursor-not-allowed"
                : isSelected
                ? "border-violet-700 cursor-pointer"
                : "border-gray-300 hover:border-violet-700 cursor-pointer"
            }`}
        >
          {/* Out of Stock Overlay */}
          {doseStatus === 0 && <div className="h-full w-full top-0 left-0 absolute cursor-not-allowed z-10 thin-font"></div>}
          {/* Out of Stock Ribbon */}
          {doseStatus === 0 && (
            <div className="absolute -right-8 top-5 bg-red-500 text-white px-[30px] text-xs py-1 rounded-tr rotate-45 z-20 thin-font">
              Out of stock
            </div>
          )}
          {/* Radio Button in Top Left */}
          <div className="absolute top-3 left-3">
            <input
              type="radio"
              checked={isSelected}
              onChange={handleSelected}
              disabled={doseStatus === 0}
              className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-violet-700 checked:bg-violet-700 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="absolute top-3 left-3">
            <div
              onClick={handleSelected}
              className={`w-5 h-5 border-2 border-gray-400 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300
                ${isSelected ? "border-violet-700 bg-violet-700" : "bg-white"}
                ${doseStatus === 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isSelected && <FaCheck size={10} color="white" />}
            </div>
          </div>
          {/* Product Name & Dosage */}
          <div className="w-full flex flex-col gap-2 mt-4">
            <div className="text-white bg-violet-700 font-reg text-center py-2 rounded-md text-xs">{productName}</div>
            <div className="text-white bg-violet-700 font-reg text-center py-2 rounded-md text-xs">{doseData.name}</div>
          </div>
          <h5 className="font-normal xl:text-[15px] md:text-[12px] mt-3 text-red-600">
            {doseData?.expiry ? `Expiry: ${moment(doseData?.expiry).format("DD/MM/YYYY")}` : ""}
          </h5>
          {/* Price */}
          <span className="font-bold text-md mt-2 block ">£{parseFloat(doseData.price).toFixed(2)}</span>
        </div>
        {isSelected && (
          <div className="w-full sm:w-48 flex items-center justify-evenly bg-violet-700 py-2  rounded-bl-lg rounded-br-lg">
            <button type="button" onClick={handleDecrement} className=" text-white px-2 py-1 rounded-md transition-all duration-300">
              <FaMinus size={12} />
            </button>
            <span className="mx-2 px-3 py-1 bg-white text-gray-900 text-sm font-semibold rounded-md">{doseData.qty}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className={` text-white  px-2 py-1 rounded-md transition-all duration-300 ${
                totalSelectedQty >= allowed ? "cursor-not-allowed opacity-60" : ""
              }`}
              disabled={totalSelectedQty >= allowed}
            >
              <FaPlus size={12} />
            </button>
          </div>
        )}
        {/* Remove Button (Only When Selected) */}
        {/* {isSelected && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(doseData);
              }}
              className="bg-red-100 hover:bg-red-200 text-red-500 rounded-md px-3 py-1 mt-2 flex items-center"
            >
              <span
              // onClick={(e) => handleStopModal(e, isVisible)} // Ensure modal closes
              >
                <HiOutlineTrash />{" "}
                <span className="font-semibold text-sm px-1">
                  Remove
                </span>
              </span>
            </button>
          </div>
        )} */}
        {doseStatus === 0 && (
          <div className="relative group inline-block">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNotifiedClick(doseData);
              }}
              className="mt-2 px-2 py-2"
            >
              {/* <span className="inline-flex items-center justify-center px-2 py-0.5 ms-2 text-md text-green-600 cursor-pointer shadow-sm bg-green-100 hover:bg-green-200 rounded">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="font-semibold text-sm px-2">Loading...</span>
                  </>
                ) : (
                  <>
                    <FaInfoCircle />
                    <span className="font-semibold text-sm px-1">Get Notified</span>
                  </>
                )}
              </span> */}
            </button>

            {/* Tooltip */}
            <div className="absolute left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              You'll be notified when this item is back in stock.
            </div>
          </div>
        )}

        <div className="flex justify-center">
          {isSelected && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(doseData);
              }}
              className="mt-2 px-2 py-2"
            >
              <span className="inline-flex items-center justify-center px-2 py-0.5 ms-2 text-md text-red-600 cursor-pointer  shadow-sm bg-red-100 hover:bg-red-200 rounded ">
                <HiOutlineTrash /> <span className="font-semibold text-sm px-1">Remove</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal showModal={showModal} onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />
    </>
  );
};
export default Dose;
