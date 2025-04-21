import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { nextStep, prevStep } from "../../store/slice/stepper";
// import { addToCart, removeFromCart, updateCart } from "../../store/slice/cartSlice";
import toast from "react-hot-toast";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
// import { useGetPrevsMutation, usePostStepsMutation } from "../../store/services/Steps/Steps";
// import OrderSummary from "../OrderSummary/OrderSummary";
// import OrderSummaryAddons from "../AddonList/OrderSummaryAddons";
// import { addToCartAddon, removeFromCartAddon, updateCartAddon } from "../../store/slice/addonCartSlice";
// import DosageCheckPopup from "../DosageCheckPopup/DosageCheckPopup";
import { Checkbox, FormControlLabel } from "@mui/material";
// import { setStockLoading } from "../../store/slice/stockLoaderSlice";
import Dose from "@/Components/Dose/Dose";
import AddOn from "@/Components/AddOn/AddOn";
import OrderSummary from "@/Components/OrderSummary/OrderSummary";
import OrderSummaryAddons from "@/Components/AddonList/OrderSummaryAddons";
import DosageCheckPopup from "@/Components/DosageCheckPopup/DosageCheckPopup";
import StepperWrapper from "@/layout/StepperWrapper";

export default function step6() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change to "auto" for instant scrolling
    });
  }, []);
  //   const reorder_concent = JSON.parse(localStorage.getItem("reorder") || "false"); // ✅ Convert to Boolean

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
  });
  //   const [getPrev] = useGetPrevsMutation();
  const [removeSeleted, setRemoveSelected] = useState([]);

  const [removeSeletedAddon, setRemoveSelectedAddon] = useState([]);
  //   const stepProps = JSON.parse(localStorage.getItem("stepPrevApiData"));

  const clinic_id = 1;
  //   const url = import.meta.env.VITE_BASE_URL;

  const [addons, setAddons] = useState([]);
  const [variations, setVariations] = useState([]);
  const [product, setProduct] = useState({});
  const addonCart = useSelector((state) => state.addonCart) || [];

  //   const cart = useSelector((state) => state.cart.cart);
  const [isExpiryRequired, setIsExpiryRequired] = useState(false);

  // ✅ useEffect to check if `product?.show_expiry` is `0` or `1`
  useEffect(() => {
    if (product?.show_expiry === 1) {
      setIsExpiryRequired(true);
    } else {
      setIsExpiryRequired(false);
      clearErrors("terms");
      setValue("terms", false);
    }
  }, [product?.show_expiry, clearErrors, setValue]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     dispatch(setStockLoading(false));
  //     const pid = localStorage.getItem("pid");
  //     // localStorage.setItem("pid", pid);
  //     const p_id = localStorage.getItem("p_id");
  //     localStorage.setItem("comingFromStart", 0);
  //     localStorage.setItem("start_concent", true);

  //     if (localStorage.getItem("in_stock")) {
  //       localStorage.removeItem("in_stock");
  //     }

  //     try {
  //       const response = await getPrev({ url, clinic_id, product_id: pid || p_id }).unwrap();
  //       const res = response?.data;
  //       if (res !== null) {
  //         const vari = res?.selected_product?.variations || [];
  //         const addon = res?.selected_product?.addons || [];
  //         const pro = res?.selected_product || {};

  //         const updatedVariations = vari.map((v, index) => ({ ...v, qty: 0, index }));
  //         const updatedAddons = addon.map((a, index) => ({ ...a, qty: 0, index }));
  //         const product = pro && typeof pro === "object" && !Array.isArray(pro) ? { ...pro, qty: 0 } : {};

  //         setProduct(product);
  //         setAddons(updatedAddons);
  //         setVariations(updatedVariations);

  //         localStorage.setItem("items", JSON.stringify({ product, addons: updatedAddons, variations: updatedVariations }));

  //         if (cart.length > 0) {
  //           const items = JSON.parse(localStorage.getItem("items"));

  //           if (items) {
  //             const updatedVariations = items?.variations?.map((v, index) => {
  //               const isSelected = cart.some((item) => item.id === v.id);
  //               const cartItem = cart.find((item) => item.id === v.id);

  //               const updatedQty = cartItem ? cartItem.qty : v.qty;

  //               return { ...v, qty: updatedQty, index, isSelected };
  //             });
  //             setVariations(updatedVariations);
  //           }

  //           if (addonCart?.addonCart?.length > 0) {
  //             const items = JSON.parse(localStorage.getItem("items"));

  //             if (items) {
  //               const updatedAddons = items?.addons?.map((v, index) => {
  //                 const isSelected = addonCart?.addonCart?.some((item) => item.id === v.id);
  //                 const cartItem = addonCart?.addonCart?.find((item) => item.id === v.id);

  //                 const updatedQty = cartItem ? cartItem.qty : v.qty;

  //                 return { ...v, qty: updatedQty, index, isSelected };
  //               });
  //               setAddons(updatedAddons);
  //             }
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch previous steps:", err);
  //     }
  //   };

  //   fetchData();
  //   const items = JSON.parse(localStorage.getItem("items"));
  //   if (items) {
  //     setProduct(items.product);
  //     setAddons(items.addons);
  //     setVariations(items.variations);
  //   }
  // }, []);
  const [isDoseSelected, setIsDoseSelected] = useState(false);

  useEffect(() => {
    const hasSelectedDose = variations.some((dose) => dose.qty > 0);
    setIsDoseSelected(hasSelectedDose);
  }, [variations]);

  //   useEffect(() => {
  //     const items = JSON.parse(localStorage.getItem("items"));

  //     if (items && Array.isArray(items.variations)) {
  //       const updatedVariations = items.variations.map((v, index) => {
  //         const isSelected = Array.isArray(cart) && cart.some((item) => item.id === v.id);

  //         const cartItem = Array.isArray(cart) && cart.find((item) => item.id === v.id);

  //         const updatedQty = cartItem ? cartItem.qty : v.qty;

  //         return { ...v, qty: updatedQty, index, isSelected };
  //       });

  //       setVariations(updatedVariations);
  //     }
  //   }, [cart]);

  const getTotalSelectedQty = () => variations.reduce((total, v) => total + v.qty, 0);
  // implement hig dose logic here 🤦‍♂️🤦‍♀️

  const [modalOpen, setModalOpen] = useState(false);
  const [openedVariationIndex, setOpenedVariationIndex] = useState([]);
  const [ModalMessage, setModalMessage] = useState("");
  // const cartRef = useRef();

  const [AllSelectedMessage, SetAllSelectedMessage] = useState(() => {
    // const savedMessages = localStorage.getItem("selectedMessages");
    // return savedMessages ? { messages: JSON.parse(savedMessages) } : { messages: [] };
  });

  const extractMgValue = (name) => {
    const mgMatch = name.match(/\d+(\.\d+)?/);
    return mgMatch ? parseFloat(mgMatch[0]) : 0;
  };
  const generateMessages = (variations, selectedDose) => {
    const sortedVariations = variations.map((item) => ({ ...item, mgValue: extractMgValue(item?.name) })).sort((a, b) => a.mgValue - b.mgValue);

    const lowestDose = sortedVariations[0];
    const messages = {};

    console.log(variations, selectedDose, sortedVariations, "sdsdsd");
    const selectedIndex = sortedVariations.findIndex((item) => item.mgValue === selectedDose);
    const prevDose = selectedIndex > 0 ? sortedVariations[selectedIndex - 1] : null;

    messages[selectedDose] = `

      If you are taking ${name} for the first time, you will need to start the treatment on the ${
      lowestDose.mgValue
    } mg dose. If you start on the higher doses, the risk of side effects (e.g., nausea) will be very high.

      Please confirm that you are currently taking either the ${
        prevDose ? prevDose.mgValue + "mg" : ""
      } or ${selectedDose}mg dose from a different provider.
      `;

    return messages;
  };
  //   console.log(reorder_concent, "reorder_concent");
  //   const selectedMessages = AllSelectedMessage.messages;
  const handleVariationClick = (name, index) => {
    const clickedMgValue = extractMgValue(name);
    const dynamicMessages = generateMessages(variations, clickedMgValue);

    const sortedVariations = variations.map((item) => ({ ...item, mgValue: extractMgValue(item?.name) })).sort((a, b) => a.mgValue - b.mgValue);

    const lowestVariations = sortedVariations.slice(0, 2);
    const lowestMgValues = lowestVariations.map((item) => item.mgValue);

    const shouldOpenModal = !stepProps.isReturning && !openedVariationIndex.includes(index) && !lowestMgValues.includes(clickedMgValue);

    if (shouldOpenModal) {
      const message = dynamicMessages[clickedMgValue] || `You have selected ${clickedMgValue}mg.`;

      setModalMessage(message);
      setOpenedVariationIndex((prevState) => [...prevState, index]);

      const matchedVariation = variations?.find((variation) => variation.name.trim().toLowerCase() === name.trim().toLowerCase());
      const id = matchedVariation?.id || null;

      SetAllSelectedMessage((prevState) => {
        const previousMessages = Array.isArray(prevState) ? prevState : prevState?.messages || [];

        const newMessages = [...previousMessages, { id, name, message }];
        localStorage.setItem("selectedMessages", JSON.stringify(newMessages));

        return newMessages;
      });

      // ✅ Open modal only when needed
      setModalOpen(true);
    }
  };

  const onHandleConfirmation = () => {
    setModalOpen(false);
  };

  const [doses, setDose] = useState(null);

  useEffect(() => {
    const storedDoses = JSON.parse(localStorage.getItem("cart"));

    if (storedDoses) setDose(storedDoses);
  }, []);

  const updatedItems = doses?.map((item) => {
    console.log(selectedMessages, "selectedMessages");
    const messageObj = selectedMessages?.find((msg) => msg?.id === item?.id);

    return {
      ...item,
      product_concent: messageObj ? messageObj.message : item.product_concent || "No message available",
    };
  });

  const handleIncrementDose = (index) => {
    setVariations((prev) =>
      prev.map((dose, i) => {
        if (i === index) {
          const totalQty = getTotalSelectedQty() + 1;

          if (totalQty > parseInt(product.allowed)) {
            toast.error(`You can select only ${product.allowed} units in total.`);
            return dose;
          } else if (dose.qty >= dose.stock.quantity) {
            toast.error(`Only ${dose.stock.quantity} units available.`);
            return dose;
          } else {
            const updatedQty = dose.qty + 1;

            const messageObj = selectedMessages?.find((msg) => msg?.id === dose?.id);
            console.log(messageObj, "fdjdfhudfhuduhdf");

            // ✅ Assign message instantly when found
            const productConcent = messageObj?.message || dose.product_concent || "No message available";

            // ✅ Debugging Log (Ensure messageObj is found)
            console.log("Adding to Cart:", {
              id: dose?.id,
              name: dose.name,
              qty: updatedQty,
              price: dose.price,
              allowed: dose.allowed,
              item_id: dose?.id,
              product: product.name,
              product_concent: productConcent, // ✅ Message instantly added
              label: `${product.name} , ${dose?.name}`,
              isSelected: true,
            });

            dispatch(
              addToCart({
                id: dose?.id,
                name: dose.name,
                qty: updatedQty,
                price: dose.price,
                allowed: dose.allowed,
                item_id: dose?.id,
                product: product.name,
                product_concent: productConcent,
                label: `${product.name} , ${dose?.name}`,
                expiry: dose.expiry,
                isSelected: true,
              })
            );

            return { ...dose, qty: updatedQty, product_concent: productConcent };
          }
        }
        return dose;
      })
    );
  };

  const handleDecrementDose = (index) => {
    setVariations((prev) =>
      prev.map((dose, i) => {
        if (i === index && dose.qty > 0) {
          const updatedQty = dose.qty - 1;

          // ✅ Preserve product_concent if it already exists
          const messageObj = selectedMessages?.find((msg) => msg?.id === dose?.id);
          const productConcent = messageObj ? messageObj.message : dose.product_concent || null;
          dispatch(
            updateCart({
              id: dose?.id,
              name: dose.name,
              qty: updatedQty,
              price: dose.price,
              allowed: dose.allowed,
              item_id: dose?.id,
              product: product.name,
              product_concent: productConcent, // ✅ Include product_concent
              label: `${product.name} , ${dose?.name}`,
              expiry: dose.expiry,
              isSelected: true,
            })
          );

          return { ...dose, qty: updatedQty, product_concent: productConcent };
        }
        return dose;
      })
    );
  };

  const handleIncrementAddons = (index) => {
    setAddons((prev) =>
      prev.map((dose, i) => {
        if (i === index) {
          const updatedQty = dose.qty + 1;
          // dispatch(addToCartAddon({ id: index, name: dose.name, qty: updatedQty, price: dose.price }));
          dispatch(
            addToCartAddon({
              id: dose?.id,
              name: dose.name,
              qty: updatedQty,
              price: dose.price,
              allowed: dose.allowed,
              item_id: dose?.id,
              product: product.name,
              label: `${product.name} , ${dose?.name}`, // Correct concatenation
              isSelected: true,
            })
          );
          return { ...dose, qty: updatedQty };
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
          dispatch(updateCartAddon({ id: dose?.id, name: dose.name, qty: updatedQty, price: dose.price }));
          return { ...dose, qty: updatedQty };
        }
        return dose;
      })
    );
  };

  const handleSelectAddon = (e, index) => {
    e.stopPropagation();
    const currentQty = addons[index].qty;
    const totalQtyExcludingCurrent = getTotalSelectedQty() - currentQty;

    if (!addons[index].isSelected) {
      if (totalQtyExcludingCurrent + 1 <= 5) {
        handleIncrementAddons(index);
        setAddons((prev) => {
          const updatedAddons = [...prev];
          updatedAddons[index].isSelected = true;
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

  const calculateSubtotal = () => {
    const addonTotal = (Array.isArray(addonCart?.addonCart) ? addonCart?.addonCart : []).reduce(
      (total, addon) => total + (addon.qty || 0) * parseFloat(addon.price || 0),
      0
    );

    const doseTotal = (Array.isArray(variations) ? variations : []).reduce((total, dose) => total + (dose.qty || 0) * parseFloat(dose.price || 0), 0);

    return (addonTotal + doseTotal).toFixed(2);
  };

  const onSubmit = (data) => {
    dispatch(nextStep());
  };
  const handleSelect = (e, index) => {
    e.stopPropagation();
    const currentQty = variations[index].qty;
    const totalQtyExcludingCurrent = getTotalSelectedQty() - currentQty;

    if (!variations[index].isSelected) {
      if (totalQtyExcludingCurrent + 1 <= product.allowed) {
        handleIncrementDose(index);
        // setVariations((prev) => {
        //   const updatedVariations = [...prev];
        //   updatedVariations[index].isSelected = true;
        //   return updatedVariations;
        // });

        setVariations((prev) => {
          const updatedVariations = prev.map((dose, i) => (i === index ? { ...dose, isSelected: !dose.isSelected } : dose));

          // Save updated `isSelected` state to localStorage
          localStorage.setItem("selectedVariations", JSON.stringify(updatedVariations));

          return updatedVariations;
        });
      } else {
        toast.error("Cannot select more than allowed units.");
      }
    } else {
      setVariations((prev) => {
        const updatedVariations = [...prev];
        updatedVariations[index].isSelected = false;
        return updatedVariations;
      });
      handleDecrementDose(index);
    }
  };
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));

    setVariations((prev) => {
      const updatedVariations = prev.map((dose) => (dose?.id === id ? { ...dose, isSelected: false } : dose));
      return updatedVariations;
    });
  };

  const handleRemoveItemAddon = (id, index) => {
    // Remove the item from the cart
    dispatch(removeFromCartAddon(id));

    setAddons((prev) =>
      prev.map((dose, i) => {
        if (i === index) {
          return { ...dose, isSelected: false };
        }
        return dose;
      })
    );
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items"));

    if (items && Array.isArray(items.addons)) {
      const updatedAddons = items.addons.map((v, index) => {
        const isSelected = Array.isArray(addonCart?.addonCart) && addonCart?.addonCart?.some((item) => item.id === v.id);
        const cartItem = Array.isArray(addonCart?.addonCart) && addonCart?.addonCart?.find((item) => item.id === v.id);
        const updatedQty = cartItem ? cartItem.qty : v.qty;
        return { ...v, qty: updatedQty, index, isSelected };
      });

      setAddons(updatedAddons);
    } else {
      setAddons([]);
    }
  }, [addonCart?.addonCart]);

  return (
    <section className="px-6 py-6 my-8 bg-[#dacfff]">
      <div className="w-full  bg-white rounded-xl py-12">
        <div className="flex justify-start"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column (Main Content) */}
            <div className="col-span-12 sm:col-span-8 md:px-4">
              {/* Product Info */}
              {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="bg-violet-700 p-6">
                  <img src={product?.img} alt={product?.name} className="w-full h-40 object-contain" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl mb-4">{product?.name}</h2>
                  <span className="text-gray-800">From £{product?.price}</span>
                </div>
              </div> */}

              <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light">
                Suggested
                <span className="font-bold"> Treatment</span>
              </h1>
              <div className="bg-gray-100 border border-gray-200 mt-4 flex flex-row items-center md:w-full rounded-lg shadow">
                <img
                  className="bg-white p-4 object-cover rounded-lg w-2/5 md:h-auto md:w-1/4 md:rounded-none md:rounded-s-lg"
                  src={product.img}
                  alt=""
                />
                <div className="flex flex-col justify-between p-4 leading-normal md:w-[65%]">
                  <h5 className="mb-2 md:text-2xl font-bold tracking-tight text-gray-900 ">{product.name}</h5>
                  <p className="mb-3 font-normal text-gray-700  text-sm">From £{product.price}</p>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-light my-4 pt-3">
                Select
                <span className="font-bold"> Dosage</span>
              </h2>
              <div className="grid grid-cols-2 w-full md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-5 md:w-full sm:w-[50%]">
                {Array.isArray(variations) &&
                  variations.map((dose, index) => (
                    <Dose
                      key={index}
                      id={dose.id}
                      index={index}
                      onClick={() => handleVariationClick(dose.name, index)}
                      doseData={dose || cart}
                      allowed={parseInt(product?.allowed)}
                      onIncrement={() => handleIncrementDose(index)}
                      onDecrement={() => handleDecrementDose(index)}
                      totalSelectedQty={getTotalSelectedQty()}
                      isSelected={dose.qty > 0}
                      productName={product?.name}
                      onSelect={(e) => {
                        setRemoveSelected((prevState) => [...prevState, { e, index }]);
                        handleSelect(e, index);
                      }}
                      cart={cart}
                      setVariations={setVariations}
                      handleRemoveItem={handleRemoveItem}
                      handleSelect={handleSelect}
                      removeSeleted={removeSeleted}
                      setRemoveSelected={setRemoveSelected}
                      handleVariationClick={handleVariationClick}
                    />
                  ))}
              </div>
              {console.log(product, "sdsdsdsd")}
              {product?.show_expiry === 1 && (
                <div className="flex flex-col space-y-2 text-sm py-3 mt-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("terms", {
                          required: isExpiryRequired ? "Please confirm that you have read and acknowledged the expiry information." : false, // ❌ No validation if not required
                        })}
                        icon={<span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center" />}
                        checkedIcon={
                          <span className="w-5 h-5 border-2 border-violet-700 rounded-full flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-violet-700 rounded-full" />
                          </span>
                        }
                        sx={{
                          "& .MuiSvgIcon-root": {
                            display: "none", // Hide default Material-UI checkbox icon
                          },
                        }}
                      />
                    }
                    label={
                      <p className="font-sans font-bold text-md italic">
                        Please confirm that you have reviewed the expiry dates of the selected doses.
                      </p>
                    }
                  />

                  {/* ✅ Show Error Message If Required and Checkbox is Not Checked */}
                  {errors.terms && <p className="text-red-600 text-xs font-semibold">{errors.terms.message}</p>}
                </div>
              )}

              <div className="flex flex-col mt-4">
                {addons?.length > 0 && (
                  <>
                    <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-light my-4">
                      Select
                      <span className="font-bold"> Addons</span>
                    </h2>

                    {/* FLEX ROW TO SHOW IN ONE LINE */}
                    <div className="flex flex-wrap gap-4">
                      {addons.map((dose, index) => (
                        <AddOn
                          key={index}
                          id={dose.id}
                          doseData={dose}
                          allowed={parseInt(5)}
                          onIncrement={() => handleIncrementAddons(index)}
                          onDecrement={() => handleDecrementAddons(index)}
                          totalSelectedQty={getTotalSelectedQty()}
                          isSelected={dose.qty > 0}
                          onSelect={(e) => {
                            setRemoveSelectedAddon((prevState) => [...prevState, { e, index }]);
                            handleSelectAddon(e, index);
                          }}
                          setAddons={setAddons}
                          handleRemoveItemAddon={handleRemoveItemAddon}
                          handleSelectAddon={handleSelectAddon}
                          removeSeletedAddon={removeSeletedAddon}
                          setRemoveSelectedAddon={setRemoveSelectedAddon}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="sm:flex justify-normal mt-6 hidden ">
                <BackButton label="Back" onClick={() => dispatch(prevStep())} />
                <NextButton label="Proceed to Checkout" disabled={!isValid || !isDoseSelected} />
              </div>
            </div>

            {/* Right Column (Order Summary) */}
            <div className="col-span-12 sm:col-span-4">
              <div className="relative lg:sticky lg:top-[7rem]">
                <div
                  className="mx-auto md:mr-auto md:ml-0 w-full max-w-sm p-2 bg-gray-100 border border-gray-200 rounded-lg
        shadow sm:p-6 "
                >
                  <h2 className="text-lg font-semibold mb-4 p-4">Order Summary</h2>

                  <div className="overflow-y-auto max-h-56 p-2">
                    <OrderSummary
                      //   cart={cart}
                      setVariations={setVariations}
                      handleRemoveItem={handleRemoveItem}
                      handleSelect={handleSelect}
                      removeSeleted={removeSeleted}
                      setRemoveSelected={setRemoveSelected}
                    />
                    <OrderSummaryAddons
                      cart={addonCart?.addonCart}
                      setAddons={setAddons}
                      handleRemoveItem={handleRemoveItemAddon}
                      handleSelect={handleSelectAddon}
                      removeSeleted={removeSeletedAddon}
                      setRemoveSelected={setRemoveSelectedAddon}
                    />
                  </div>

                  {modalOpen && <DosageCheckPopup text={ModalMessage} onHandleConfirmation={onHandleConfirmation} />}

                  <div className="flex justify-between items-center border-t border-gray-300 p-6 mt-4">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className="font-semibold text-lg">£{calculateSubtotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* <div className="flex justify-between mt-6 block sm:hidden fixed bottom-0 bg-gray-200 w-full z-50">
        <PrevButton label="Back" onClick={() => dispatch(prevStep())} />
        <NextButton label="Proceed to Checkout" disabled={!isValid || !isDoseSelected} />
      </div> */}
      <div className="fixed bottom-2 w-[95%] mx-auto left-0 right-0 z-50 block sm:hidden">
        <div className="relative flex justify-between items-center bg-white/30 backdrop-blur-lg rounded-lg py-3 px-6 shadow-lg border border-white/40">
          {/* Content Layer (to prevent blur on buttons) */}
          <div className="relative flex w-full justify-between items-center">
            {/* Back Button */}
            <button
              onClick={() => dispatch(prevStep())}
              className="flex flex-col items-center justify-center text-white rounded-md bg-violet-700 p-3"
            >
              <span className="text-md font-semibold px-2">Back</span>
            </button>

            {/* Proceed Button */}
            <button
              type="submit"
              onClick={() => dispatch(nextStep())}
              disabled={!isValid || !isDoseSelected}
              className={`p-3 flex flex-col items-center justify-center ${
                !isValid || !isDoseSelected
                  ? "disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 text-white rounded-md"
                  : "text-white rounded-md bg-violet-700"
              }`}
            >
              <span className="text-md font-semibold">Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
