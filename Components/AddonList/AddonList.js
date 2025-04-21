import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep } from "../../store/slice/stepper";
import AddOn from "../AddOn/AddOn";
import toast from "react-hot-toast";
import { addToCart, removeFromCart, updateCart } from "../../store/slice/addonCartSlice";
import OrderSummaryAddons from "../AddonList/OrderSummaryAddons";
import { useGetPrevsMutation } from "../../store/services/Steps/Steps";
const AddonList = () => {
  const dispatch = useDispatch();
  const [getPrev] = useGetPrevsMutation();
  const [removeSeleted, setRemoveSelected] = useState([]);
  const clinic_id = 1;
  const url = import.meta.env.VITE_BASE_URL;

  const [addons, setAddons] = useState([]);
  const [variations, setVariations] = useState([]);
  const [product, setProduct] = useState([]);

  const addonCart = useSelector((state) => state.addonCart) || [];
  // const addonCart = [];

  useEffect(() => {
    const fetchData = async () => {
      const pid = localStorage.getItem("pid");
      // localStorage.setItem("pid", pid);
      localStorage.setItem("comingFromStart", 0);
      localStorage.setItem("start_concent", true);

      try {
        const response = await getPrev({ url, clinic_id, product_id: pid }).unwrap();
        const res = response?.data;
        if (res !== null) {
          const vari = res?.selected_product?.variations || [];
          const addon = res?.selected_product?.addons || [];
          const pro = res?.selected_product || {};

          const updatedVariations = vari.map((v, index) => ({ ...v, qty: 0, index }));
          const updatedAddons = addon.map((a, index) => ({ ...a, qty: 0, index }));
          const product = pro && typeof pro === "object" && !Array.isArray(pro) ? { ...pro, qty: 0 } : {};

          setProduct(product);
          setAddons(updatedAddons);
          setVariations(updatedVariations);

          localStorage.setItem("items", JSON.stringify({ product, addons: updatedAddons, variations: updatedVariations }));
          if (addonCart?.addonCart?.length > 0) {
            const items = JSON.parse(localStorage.getItem("items"));

            if (items) {
              const updatedAddons = items?.addons?.map((v, index) => {
                const isSelected = addonCart?.addonCart?.some((item) => item.id === v.index);
                const cartItem = addonCart?.addonCart?.find((item) => item.id === v.index);

                const updatedQty = cartItem ? cartItem.qty : v.qty;

                return { ...v, qty: updatedQty, index, isSelected };
              });
              setAddons(updatedAddons);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch previous steps:", err);
      }
    };

    fetchData();

    // const items = JSON.parse(localStorage.getItem("items"));
    // if (items) {

    //     setAddons(items.addons);
    // }
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items"));

    if (items && Array.isArray(items.addons)) {
      const updatedAddons = items.addons.map((v, index) => {
        const isSelected = Array.isArray(addonCart?.addonCart) && addonCart?.addonCart?.some((item) => item.id === v.index);
        const cartItem = Array.isArray(addonCart?.addonCart) && addonCart?.addonCart?.find((item) => item.id === v.index);
        const updatedQty = cartItem ? cartItem.qty : v.qty;
        return { ...v, qty: updatedQty, index, isSelected };
      });

      setAddons(updatedAddons);
    } else {
      setAddons([]); // Set empty addons if not found or invalid.
    }
  }, [addonCart?.addonCart]);

  const getTotalSelectedQty = () => addons.reduce((total, v) => total + v.qty, 0);

  const handleIncrementDose = (index) => {
    setAddons((prev) =>
      prev.map((dose, i) => {
        if (i === index) {
          // const totalQty = getTotalSelectedQty() + 1;

          // if (totalQty > parseInt(5)) {
          //     toast.error(`You can select only ${product.allowed} units in total.`);
          //     return dose;
          // } else if (dose.qty >= dose.stock.quantity) {
          //     toast.error(`Only ${dose.stock.quantity} units available.`);
          //     return dose;
          // } else {
          const updatedQty = dose.qty + 1;
          dispatch(addToCart({ id: index, name: dose.name, qty: updatedQty, price: dose.price }));
          return { ...dose, qty: updatedQty };
          // }
        }
        return dose;
      })
    );
  };

  const handleDecrementAddons = (index) => {
    setAddons((prev) =>
      prev.map((dose, i) => {
        if (i === index && dose.qty > 0) {
          const updatedQty = dose.qty - 1;
          dispatch(updateCart({ id: index, name: dose.name, qty: updatedQty, price: dose.price }));
          return { ...dose, qty: updatedQty };
        }
        return dose;
      })
    );
  };

  // const calculateSubtotal = () => {
  //     const addonTotal = addons.reduce(
  //         (total, addon) => total + addon.qty * parseFloat(addon.price),
  //         0
  //     );
  //     return (addonTotal + doseTotal).toFixed(2);
  // };

  const handleSelect = (e, index) => {
    e.stopPropagation();
    const currentQty = addons[index].qty;
    const totalQtyExcludingCurrent = getTotalSelectedQty() - currentQty;

    if (!addons[index].isSelected) {
      if (totalQtyExcludingCurrent + 1 <= 5) {
        handleIncrementDose(index);
        setAddons((prev) => {
          const updatedAddons = [...prev];
          updatedAddons[index].isSelected = true; // Set isSelected to true
          return updatedAddons;
        });
      } else {
        toast.error("Cannot select more than allowed units.");
      }
    } else {
      setAddons((prev) => {
        const updatedAddons = [...prev];
        updatedAddons[index].isSelected = false;
        return updatedAddons;
      });
      handleDecrementAddons(index);
    }
  };
  const handleRemoveItem = (id, index) => {
    // Remove the item from the cart
    dispatch(removeFromCart(id));

    setAddons((prev) =>
      prev.map((dose, i) => {
        if (i === index) {
          return { ...dose, isSelected: false }; // Unselect the dose
        }
        return dose;
      })
    );
  };

  return (
    <>
      {/* {addons?.map((dose, index) => (
            <AddOn
                key={index}
                id={dose.id}
                doseData={dose}
                allowed={parseInt(5)}
                onIncrement={() => handleIncrementDose(index)}
                onDecrement={() => handleDecrementAddons(index)}
                totalSelectedQty={getTotalSelectedQty()}
                isSelected={dose.qty > 0}
                onSelect={(e) => {
                    setRemoveSelected(prevState => [
                        ...prevState,
                        { e, index }
                    ]);
                    handleSelect(e, index);
                }}
            />


        ))} */}

      {/* <div className="flex justify-between py-4 my-6">
            <span>Total</span>
            <span>£{calculateSubtotal()}</span>
        </div> */}
      <OrderSummaryAddons
        cart={addonCart?.addonCart}
        setAddons={setAddons}
        handleRemoveItem={handleRemoveItem}
        handleSelect={handleSelect}
        removeSeleted={removeSeleted}
        setRemoveSelected={setRemoveSelected}
      />
    </>
  );
};

export default AddonList;
