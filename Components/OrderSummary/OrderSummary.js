import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import ConfirmationModal from "../Modal/ConfirmationModal";

const OrderSummary = ({ cart, handleRemoveItem, handleSelect, removeSeleted, setRemoveSelected, setVariations }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // const calculateSubtotal = () => {
  //   return cart.reduce((total, item) => total + item.qty * parseFloat(item.price), 0).toFixed(2);
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
        setVariations((prev) => {
          const updatedVariations = [...prev];
          // updatedVariations[itemToRemove.id].isSelected = false;
          return updatedVariations;
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
  // const needlePack = {

  //   allowed => "1",
  //     item_id => 99,
  //     quantity => tem.qty,
  //     price => "0.00",
  //     name => "Pack of 5 Needle",
  //     product => "",
  //     label => "Pack of 5 Needle",
  //     checked => true,
  //     product_concent => null,
  // }
  return (
    <>
      {/* <div className="">
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <React.Fragment key={item.id}>
              Main Cart Item
              <div className="flex justify-between items-center bg-[#E8E1FC] px-4 py-3 rounded-lg mb-3">
                <span className="text-black font-med text-sm flex-1 sm:truncate">
                  {item.product} {item.name}, {item.qty}x
                  <span className="font-bold mx-1 text-md">£{(item.qty * parseFloat(item.price)).toFixed(2)}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id, index)}
                  className="bg-red-100 hover:bg-red-200 text-red-500 rounded-md p-2 ml-3"
                >
                  <MdDelete />
                </button>
              </div>

              Show Pack of 5 Needle ONLY for "Mounjaro (Tirzepatide)"
              {item.product === "Mounjaro (Tirzepatide)" && (
                <div key={`${item.id}-needle`} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg mb-3">
                  <span className="text-gray-700 text-sm flex-1">
                    Pack of 5 Needle, {item.qty}x<span className="font-bold mx-1 text-md">£0.00</span>
                  </span>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-500 text-sm"></p>
        )}
      </div> */}

      <div className="">
        <p className="text-gray-500 text-sm"></p>
      </div>

      {/* <div className="flex justify-between items-center border-t border-gray-300 pt-4 mt-4">
        <span className="font-medium text-gray-700">Subtotal</span>
        <span className="font-semibold text-lg">£{calculateSubtotal()}</span>
      </div> */}

      {/* Confirmation Modal */}
      <ConfirmationModal showModal={showModal} onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />
    </>
  );
};

export default OrderSummary;

{
  /* <div className="p-4">
{cart.length > 0 ? (
  cart.map((item, index) => (
    <div
      key={item.id}
      className="flex justify-between items-center bg-purple-100 px-4 py-3 rounded-lg mb-3"
    >
      <span className="text-black text-sm flex-1 truncate">
        {item.product} ({item.name}), {item.qty}x £{(item.qty * parseFloat(item.price)).toFixed(2)}
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
) : (
  <p className="text-gray-500 text-sm">Your cart is empty.</p>
)}
</div> */
}
