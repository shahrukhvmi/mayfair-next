import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { HiOutlineTrash } from "react-icons/hi";

const AddOn = ({
  id,
  doseData,
  allowed,
  onIncrement,
  onDecrement,
  totalSelectedQty,
  isSelected,
  onSelect,
  setAddons,
  handleRemoveItemAddon,
  handleSelectAddon,
  removeSeletedAddon,
  setRemoveSelectedAddon,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleDeleteClick = (addon) => {
    setItemToRemove(addon);
    setShowModal(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      const removeitem = removeSeletedAddon.filter((item) => item.id === itemToRemove.id);
      if (removeitem.length > 0) {
        handleSelectAddon(removeitem[0].e, removeitem[0].id);
        setRemoveSelectedAddon(removeSeletedAddon.filter((item) => item.id !== itemToRemove.id));
      } else {
        setAddons((prev) => {
          const updatedVariations = [...prev];
          // updatedVariations[itemToRemove.id]?.isSelected = false;
          return updatedVariations;
        });
      }
      handleRemoveItemAddon(itemToRemove.id, itemToRemove.id);
    }
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
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Main Add-On Card */}
        <div
          onClick={onSelect}
          className={`w-80 flex items-center justify-between p-6 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out
          ${isSelected ? "border-violet-700 bg-violet-300" : "border-gray-300 bg-white hover:border-violet-700"}`}
        >
          {/* Name & Price */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold">{doseData.name}</span>
            <span className="text-md text-black font-bold">£{parseFloat(doseData.price).toFixed(2)}</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement(id);
              }}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all duration-200"
              disabled={!isSelected || doseData.qty <= 0}
            >
              <FaMinus className="text-sm" />
            </button>

            <span className="text-sm font-semibold">{doseData.qty}</span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(id);
              }}
              className={`bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all duration-200 ${
                totalSelectedQty >= allowed ? "cursor-not-allowed opacity-60" : ""
              }`}
              disabled={totalSelectedQty >= allowed}
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* Remove Button (Only When Selected) */}
        {/* {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(e);
            }}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-md px-3 py-1 flex items-center gap-1"
          >
           <HiOutlineTrash />
            <span className="font-semibold text-sm">Remove</span>
          </button>
        )} */}

        {isSelected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(doseData);
            }}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-md px-3 py-1 flex items-center gap-1"
          >
            <HiOutlineTrash />
            <span className="font-semibold text-sm">Remove</span>
          </button>
        )}
      </div>
      <ConfirmationModal showModal={showModal} onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />
    </>
  );
};

export default AddOn;
