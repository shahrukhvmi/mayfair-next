import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StartConsultationModal from "../StartConsultationModal/StartConsultationModal";
import ReOrderModel from "../ReOrderModel/ReOrderModel";
import { useGetPrevsMutation } from "../../store/services/Steps/Steps";
import { useDispatch } from "react-redux";
import { setStepPrevApiData } from "../../store/slice/stepSlice";
import { useNavigate } from "react-router-dom";
import { triggerStep } from "../../store/slice/stepper";
import { clearCart } from "../../store/slice/cartSlice";
import { clearCartAddon } from "../../store/slice/addonCartSlice";

const ProductCard = ({ id, title, image, price, status, buttonText, reorder, lastOrderDate }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReorderOpen, setReorderOpen] = useState(false);
  const dispatch = useDispatch();
  const modalOpenedRef = useRef(false);
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const productId = params.get("product_id");
  //   console.log(productId, "productIdproductId")
  //   if (productId) {
  //     localStorage.setItem("pid", productId);
  //     setModalOpen(true);
  //   } else {
  //     localStorage.removeItem("pid");
  //   }
  // }, []);

  useEffect(() => {
    if (!modalOpenedRef.current) {
      const params = new URLSearchParams(location.search);
      const productId = params.get("product_id");
      const previousId = localStorage.getItem("previous_id");

      // Clear modalOpened if different product
      if (previousId && previousId !== productId) {
        localStorage.removeItem("modalOpened");
      }

      const shouldOpenModal =
        (productId && !localStorage.getItem("modalOpened") && String(productId) === String(id)) || (previousId && String(previousId) === String(id));

      if (shouldOpenModal) {
        const pidToSet = productId || previousId;

        localStorage.setItem("previous_id", pidToSet);
        localStorage.setItem("pid", pidToSet);
        localStorage.setItem("modalOpened", "true");

        reorder ? setReorderOpen(true) : setModalOpen(true);
        modalOpenedRef.current = true;
      } else if (!productId) {
        // ✅ only remove pid if no productId in URL
        localStorage.removeItem("pid");
      }
    }
  }, [location.search, reorder, id]);

  const navigate = useNavigate();

  const handleClick = () => {
    // localStorage.removeItem("previous_id")
    if (reorder) {
      localStorage.setItem("reorder", true);
      setReorderOpen(true);
      // localStorage.setItem("pid", id);
      // localStorage.setItem("comingFromStart", 0);
      // localStorage.setItem("start_concent", true);
      // localStorage.setItem("currentStep", 1);
      // dispatch(triggerStep(1));
      // dispatch(clearCart())
      // dispatch(clearCartAddon())
      // localStorage.removeItem("addonCart");
      // localStorage.removeItem("cart");
    } else {
      localStorage.setItem("reorder", false);
      setModalOpen(true);
      // localStorage.setItem("comingFromStart", 0);
      // localStorage.setItem("start_concent", true);
      // localStorage.setItem("currentStep", currentStep);
      // dispatch(triggerStep(currentStep));
      // localStorage.removeItem("addonCart");
      // localStorage.removeItem("cart");
      // dispatch(clearCart())
      // dispatch(clearCartAddon())
    }
  };
  // post pid or save preApiData
  const [getPrev, { data, error, isLoading }] = useGetPrevsMutation();
  const clinic_id = 1;
  const url = import.meta.env.VITE_BASE_URL;

  const handleConfirm = async () => {
    localStorage.removeItem("previous_id");
    localStorage.removeItem("p_id");
    const pid = Number(localStorage.getItem("pid")) || id;
    const currentStep = Number(localStorage.getItem("currentStep")) || 1;
    const reorderStatus = JSON.parse(localStorage.getItem("reorder_concent"));
    localStorage.removeItem("selectedMessages");
    localStorage.removeItem("selectedVariations");
    const ability = sessionStorage.getItem("ability");
    const isChecked = sessionStorage.getItem("ischecked");

    localStorage.setItem("pid", pid);
    localStorage.setItem("comingFromStart", 0);
    localStorage.setItem("start_concent", true);
    localStorage.removeItem("modalOpened");

    // Handle reordering or normal start...
    if (reorder) {
      if (reorderStatus) {
        localStorage.setItem("currentStep", 1);
        localStorage.removeItem("previous_id");

        dispatch(triggerStep(1));
      } else {
        localStorage.setItem("currentStep", 2);
        localStorage.removeItem("previous_id");
        dispatch(triggerStep(2));
      }
    } else {
      localStorage.setItem("currentStep", currentStep);
      dispatch(triggerStep(currentStep));
      localStorage.removeItem("previous_id");
    }

    localStorage.removeItem("addonCart");
    localStorage.removeItem("cart");
    localStorage.removeItem("selectedVariations");
    localStorage.removeItem("selectedMessages");
    dispatch(clearCart());
    dispatch(clearCartAddon());

    // Optional: Fetch previous step data
    console.log(typeof reorder?.toString(), "reorder");
    try {
      const response = await getPrev({
        url,
        clinic_id,
        product_id: id,
        reorder: reorder ? reorder : null,
      }).unwrap();
      const res = response?.data;
      if (res !== null) {
        dispatch(setStepPrevApiData(res));
      }
      // Navigate using React Router
      navigate(`/consultation-form/?product_id=${pid}`);
    } catch (err) {
      console.error("Failed to fetch previous steps:", err);
    }

    setModalOpen(false);
    setReorderOpen(false);
  };

  const handleClose = () => {
    setReorderOpen(false);
    setModalOpen(false);
    localStorage.removeItem("previous_id");
  };

  return (
    <>
      <div
        className="relative bg-white rounded-lg rounded-b-2xl overflow-hidden  transition-transform shadow-md"
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        {/* Out of Stock Overlay */}
        {!status && <div className="h-full w-full left-0 absolute bg-[rgba(119,136,153,0.4)] cursor-not-allowed z-10 thin-font"></div>}

        {/* Out of Stock Ribbon */}
        {!status && (
          <div className="absolute -left-8 top-7 bg-red-500 text-white px-[30px] text-xs py-1 rounded-tl -rotate-45 z-20 thin-font">Out of stock</div>
        )}

        {/* Price Ribbon */}
        {price && (
          <div className="absolute -right-8 top-7 bg-blue-500 text-white text-xs px-[30px] py-1 rounded-tr rotate-45 z-20 thin-font">
            From £{price}
          </div>
        )}

        {/* Product Image */}
        <div className="h-52 overflow-hidden bg-white">
          <img
            src={image}
            alt={title}
            className="w-full p-5 h-52 object-contain"
            // onError={(e) => (e.target.src = "/images/default.png")}
          />
        </div>

        {/* Product Details */}
        <div className="bg-[#EDE9FE] p-5 text-center rounded-2xl">
          <h2 className="text-lg semibold-font mb-3 text-gray-900">{title}</h2>

          <p className="mb-3 text-sm  font-semibold">{lastOrderDate && `Last Ordered: ${lastOrderDate}`}</p>
          {/* <button
            onClick={handleClick}
            className={`px-6 py-2 w-50 rounded-full text-white reg-font ${status ? "bg-[#7c3aed] hover:bg-[#fff]  hover:text-[#7c3aed] hover:scale-105" : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!status}
          >
            {buttonText}
          </button> */}

          <div className="w-full text-center">
            <button
              onClick={handleClick}
              type="button"
              className={
                status === false
                  ? "bg-[#897bba] text-white py-2 px-6 rounded-full text-sm text-center"
                  : "bg-[#5b45a7] text-white font-medium py-2 px-6 rounded-full text-sm text-center hover:bg-white hover:text-violet-700 transition-colors duration-200"
              }
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <StartConsultationModal
          loading={isLoading}
          text="Do you want to start the consultation?"
          closeModel={handleClose}
          onHandleConfirm={handleConfirm}
        />
      )}

      {isReorderOpen && <ReOrderModel loading={isLoading} text="Reorder" closeModel={handleClose} onHandleConfirm={handleConfirm} />}
    </>
  );
};

export default ProductCard;
