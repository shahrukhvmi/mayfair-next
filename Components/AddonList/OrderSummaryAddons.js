import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import ConfirmationModal from "../Modal/ConfirmationModal";

const OrderSummaryAddons = ({ cart, handleRemoveItem, handleSelect, removeSeleted, setRemoveSelected, setAddons }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // const calculateSubtotal = () => {
  //     return cart?.reduce((total, item) => total + item.qty * parseFloat(item.price), 0).toFixed(2);
  // };

  // Open modal and set the item to be removed
  const handleDeleteClick = (id, index) => {
    setItemToRemove({ id, index });
    setShowModal(true); // Show the modal
  };

  // Confirm the removal and close the modal
  const handleConfirmRemove = () => {
    if (itemToRemove) {
      const removeitem = removeSeleted.filter((item) => item.id === itemToRemove.id);
      if (removeitem.length > 0) {
        handleSelect(removeitem[0].e, removeitem[0].index);
        setRemoveSelected(removeSeleted.filter((item) => item.id !== itemToRemove.id));
      } else {
        setAddons((prev) => {
          const updatedAddons = [...prev];
          // updatedAddons[itemToRemove.id].isSelected = false;
          return updatedAddons;
        });
      }
      handleRemoveItem(itemToRemove.id, itemToRemove.index);
    }
    setShowModal(false); // Close the modal
  };

  useEffect(() => {
    if (itemToRemove) {
      setShowModal(true);
    }
  }, [itemToRemove]);
  const handleCancelRemove = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* <div className="">
        {cart.length > 0
          ? cart.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center bg-[#E8E1FC] px-4 py-3 rounded-lg mb-3">
                <span className="text-black font-med text-sm flex-1 sm:truncate">
                  {item.name}, {item.qty}x<span className="font-bold mx-1 text-md">£{(item.qty * parseFloat(item.price)).toFixed(2)}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id, index)}
                  className="bg-red-100 hover:bg-red-200 text-red-500 rounded-md p-2 ml-3"
                >
                  <MdDelete />
                </button>
              </div>
            ))
          : ""}
      </div> */}

      <div className="">Cart here</div>

      {/* Confirmation Modal */}
      <ConfirmationModal showModal={showModal} onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />
    </>
  );
};

export default OrderSummaryAddons;
