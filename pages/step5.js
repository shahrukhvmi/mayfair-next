import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
// import { nextStep, prevStep } from "../../store/slice/stepper";
import { FaArrowRight, FaArrowLeft, FaCheck, FaChevronDown } from "react-icons/fa";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { BiSearchAlt } from "react-icons/bi";
import toast from "react-hot-toast";
// import { usePostStepsMutation } from "../../store/services/Steps/Steps";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
import StepperWrapper from "@/layout/StepperWrapper";
import { useRouter } from "next/router";
import { setStep5 } from "@/store/steps";
// import { setStep5 } from "../../store/slice/stepSlice";

function Step5() {
  const router = useRouter();
  const dispatch = useDispatch();
  const step5Data = useSelector((state) => state.steps.step5);

  console.log(step5Data, "step5Data");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change to "auto" for instant scrolling
    });
  }, []);

  //   const currentStep = useSelector((state) => state.step.currentStep);
  //   const [postSteps, { error: isError, isLoading }] = usePostStepsMutation();
  const [lastConsultation, setLastConsultation] = useState(null);
  const [prevStepFiveData, setprevStepFiveData] = useState(null);
  const [btnZipCode, setbtnZipCode] = useState(false);

  useEffect(() => {
    // const stepPrevAPiData = localStorage.getItem("stepPrevApiData");
    // const stepFivePrev = localStorage.getItem("step5");
    if (step5Data !== null || step5Data !== undefined) {
      const dataParse = step5Data;
      // const stepfiveParse = JSON.parse(stepFivePrev);
      const stepfiveParse = step5Data !== undefined && step5Data != "undefined" && step5Data ? step5Data : undefined;

      setLastConsultation(dataParse);
      setprevStepFiveData(stepfiveParse);
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // Watch form values
  const gpDetails = watch("gpDetails");
  const gepTreatMent = watch("gepTreatMent");
  const postalCode = watch("postalCode");
  const searchClicked = watch("searchClicked", false);
  const addressOptions = watch("addressOptions", []);
  const selectedAddress = watch("selectedAddress", null);
  //   const reorder_concent = localStorage.getItem("reorder_concent") || null;

  //   const getPid = localStorage.getItem("pid");
  //   const stockPid = localStorage.getItem("p_id");

  const onSubmit = async (data, e) => {
    const gpDetails = {
      gpConsent: data.gpDetails,
      consentDetail: data.gpDetails === "yes" ? data.gepTreatMent : "",
      email: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.email : "",
      gpName: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.gpName : "",
      zipcode: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.postalCode : "",
      addressLine1: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.addressLine1 : "",
      addressLine2: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.addressLine2 : "",
      state: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.state : "",
      city: data.gpDetails === "yes" && data.gepTreatMent === "yes" ? data.city : "",
    };
    console.log(gpDetails, "gpDetailsgpDetailsgpDetailsgpDetailsgpDetails");
    dispatch(setStep5(gpDetails));
    router.push("/step6");
    // try {
    //   const response = await postSteps({
    //     gpdetails: gpDetails,
    //     pid: getPid || stockPid,
    //     reorder_concent: reorder_concent ? reorder_concent.toString() : null,
    //   }).unwrap();
    //   if (response.status === true) {
    //     dispatch(nextStep());
    //     dispatch(setStep5(response?.lastConsultation?.fields?.gpdetails));
    //   }
    //   // e.preventDefault();
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleSelect = (index) => {
    const selected = addressOptions[index];

    console.log(selected);

    setValue("selectedAddress", selected);
    setValue("addressLine1", selected.Address1 || "");
    setValue("addressLine2", selected.Address2 || "");
    setValue("city", selected.City || "");
    setValue("state", selected.County || "");
    setValue("postalCode", postalCode || "");
    setValue("gpName", selected.OrganisationName || "");
  };

  const handleAddress = async () => {
    try {
      const response = await fetch(`https://api.nhs.uk/service-search/search-postcode-or-place?api-version=1&search=${postalCode}`, {
        method: "POST",
        headers: {
          "subscription-key": "7a46f2abc01b47b58e586ec1cda38c68",
        },
        body: JSON.stringify({
          filter: "(OrganisationTypeID eq 'GPB') or (OrganisationTypeID eq 'GPP')",
          top: 25,
          skip: 0,
          count: true,
        }),
      });
      const data = await response.json();
      if (data.errorName) {
        toast.error("No address found for the given postal code.");
      }

      if (data && data.value) {
        setValue("addressOptions", data.value);
      } else {
        setValue("addressOptions", []);
        // toast.error("No address found for the given postal code.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setValue("addressOptions", []);
      toast.error("Error fetching address.");
    }
  };

  useEffect(() => {
    if (searchClicked) {
      handleAddress();
      setValue("searchClicked", false); // Reset searchClicked state
    }
  }, [searchClicked, postalCode]);

  useEffect(() => {
    if (step5Data) {
      setValue("gpDetails", step5Data?.gpConsent || "");
      setValue("gepTreatMent", step5Data?.consentDetail || "");
      setValue("email", step5Data?.email || "");
      setValue("gpName", step5Data?.gpName || "");
      setValue("postalCode", step5Data?.zipcode || "");
      setValue("addressLine1", step5Data?.addressLine1 || "");
      setValue("addressLine2", step5Data?.addressLine2 || "");
      setValue("state", step5Data?.state || "");
      setValue("city", step5Data?.city || "");
    }

    trigger("gpDetails");
  }, [setValue, step5Data, trigger]);

  const textFieldStyles = {
    "& label": {
      color: "#6b7280", // Default label color
      fontSize: 16,
      top: "-2px",
    },
    "& label.Mui-focused": {
      color: "#6c757d", // Label color when focused
    },
    "& .MuiInputBase-input": {
      color: "#111827", // Text color inside input
      borderBottom: "2px solid #f2f3f5",
    },
    "& .MuiInputBase-input:focus": {
      color: "#111827", // Text color inside input
      borderBottom: "2px solid #f7a564",
    },
    "& .MuiInput-underline:before": {
      display: "none", // Default underline color
    },
    "& .MuiInput-underline:hover:before": {
      display: "none", // Default underline color
    },
    "& .MuiInput-underline:after": {
      display: "none", // Default underline color
    },
  };

  const selectStyles = {
    "& label": {
      color: "#6b7280", // Default label color
      fontSize: 20,
      top: "-2px",
    },
    "& label.Mui-focused": {
      color: "#6c757d", // Label color when focused
    },
    "& .MuiSelect-select": {
      color: "#111827", // Text color inside select
      borderBottom: "2px solid #f2f3f5", // Custom bottom border
    },
    "& .MuiSelect-select:focus": {
      color: "#111827",
      borderBottom: "2px solid #f7a564", // Focus bottom border
    },
    "& .MuiInput-underline:before": {
      display: "none", // Removes default underline
    },
    "& .MuiInput-underline:hover:before": {
      display: "none",
    },
    "& .MuiInput-underline:after": {
      display: "none",
    },
  };

  // Effect to enable/disable the button
  useEffect(() => {
    setbtnZipCode(!postalCode?.trim()); // Disable if empty
  }, [postalCode]);

  return (
    <StepperWrapper>
      <div className="pb-20 sm:pb-0 px-12 my-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step Indicator */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light">
              Step 5: <span className="font-bold">GP Details</span>
            </h1>
            <p className="text-muted-2 pt-3 hidden">
              Your Doctor/GP of any treatment you receive. If you are registered with a GP in the UK then we can inform them on your behalf.
            </p>
          </div>

          <h3 className=" font-medium text-base leading-5 mb-3">If you are registered with a GP in the UK then we can inform them on your behalf.</h3>

          {/* Question: Inform GP */}
          <div>
            <h1 className="text-gray-500 text-base mb-4">Are you registered with a GP in the UK?</h1>
            <div className="grid md:grid-cols-1 md:gap-4 md:w-1/2 lg:w-1/3 xl:w-2/5">
              <div className="flex gap-4">
                <label
                  htmlFor="yes"
                  className={
                    gpDetails === "yes"
                      ? "border-[#4DB581] text-gray-500 bg-green-50 border-[2px] rounded-md shadow-lg flex justify-between items-center w-28 px-4 font-medium"
                      : "border-gray-300 text-gray-500 px-4 py-2 rounded-md w-28 text-left cursor-pointer shadow-md font-medium"
                  }
                >
                  Yes {gpDetails === "yes" && <FaCheck className="ms-4 text-[#4DB581]" size={15} />}
                  <input
                    id="yes"
                    type="radio"
                    value="yes"
                    {...register("gpDetails", {
                      // required: "Please select Yes or No.",
                      required: "",
                    })}
                    className="hidden"
                  />
                </label>
                <label
                  htmlFor="no"
                  className={
                    gpDetails === "no"
                      ? "border-[#4DB581] cursor-pointer text-gray-500 rounded-md bg-green-50 border-[2px] shadow-lg flex justify-between items-center w-28 px-4"
                      : "border-gray-300 text-gray-500 px-4 py-2 rounded-md w-28 text-left cursor-pointer shadow-md"
                  }
                >
                  No {gpDetails === "no" && <FaCheck className="ms-4 text-[#4DB581]" size={15} />}
                  <input
                    id="no"
                    type="radio"
                    value="no"
                    {...register("gpDetails", {
                      required: " ",
                      // required: "Please select Yes or No.",
                    })}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.gpDetails && <p className="text-red-500 mt-2">{errors.gpDetails.message}</p>}
            </div>
          </div>

          {/* Conditional Rendering for Yes */}
          {gpDetails === "yes" && (
            <div>
              <p className="text-black mt-6 sm:mt-8 text-sm sm:text-base mb-4">
                Do you consent for us to inform your GP about the treatment we have provided?
              </p>

              {/* Options */}
              <div className="grid md:grid-cols-1">
                <div className="flex gap-4 flex-col sm:flex-row">
                  <label
                    htmlFor="gepTreatMentYes"
                    className={`${
                      gepTreatMent === "yes"
                        ? "cursor-pointer border-[#4DB581] px-4 py-2 text-sm sm:text-sm text-gray-500 rounded-md bg-green-50 border-[2px] flex justify-center items-center font-medium"
                        : "border-gray-300 px-4 py-2 text-sm sm:text-sm text-gray-500 rounded-md items-left cursor-pointer shadow-md font-medium"
                    }`}
                  >
                    Yes - Please inform my GP {gepTreatMent === "yes" && <FaCheck className="ml-2 text-[#4DB581]" size={15} />}
                    <input
                      id="gepTreatMentYes"
                      type="radio"
                      value="yes"
                      {...register("gepTreatMent", {
                        required: gpDetails === "yes" ? "Please select Yes or No." : true,
                      })}
                      className="hidden"
                    />
                  </label>

                  <label
                    htmlFor="gepTreatMentNo"
                    className={`${
                      gepTreatMent === "no"
                        ? "cursor-pointer border-[#4DB581] px-4 py-2 text-sm sm:text-sm text-gray-500 rounded-md bg-green-50 border-[2px] flex justify-center items-center font-medium"
                        : "border-gray-300 px-4 py-2 text-sm sm:text-sm text-gray-500 rounded-md items-left cursor-pointer shadow-md font-medium"
                    }`}
                  >
                    No – I will inform my GP prior to starting treatment{" "}
                    {gepTreatMent === "no" && <FaCheck className="ml-2 text-[#4DB581]" size={15} />}
                    <input
                      id="gepTreatMentNo"
                      type="radio"
                      value="no"
                      {...register("gepTreatMent", {
                        required: gpDetails === "yes" ? "Please select Yes or No." : false,
                      })}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Error Message */}
                {errors.gepTreatMent && <p className="text-red-500 mt-2 text-sm sm:text-base">{errors.gepTreatMent.message}</p>}
              </div>
            </div>
          )}

          {/* Conditional Rendering for No */}
          {gpDetails === "no" && (
            <div className="bg-[#FFF3CD] px-4 py-4 mt-6 text-gray-700 rounded-lg shadow-md hover:bg-[#FFEBB5]">
              <p className="text-sm md:text-base">
                You should inform your doctor of any medication you take. If you would like us to email you a letter to forward onto your doctor,
                please contact us.
              </p>
            </div>
          )}

          {/* Conditional Rendering for Additional Fields */}
          {gpDetails === "yes" && gepTreatMent === "yes" && (
            <div className="sm:mb-0  mb-40 mt-8">
              <div className="">
                <p className="">Please provide GP Email (optional)</p>
                <div className="flex items-center mt-4">
                  <TextField
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    sx={textFieldStyles}
                    {...register("email", {
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email format.",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </div>
              </div>
              <div className="mt-8">
                <p className="mb-2">Enter postal code to search GP address. If you can't find it enter manually.</p>
                <div className="flex items-center mt-8">
                  <div className="flex items-center">
                    <TextField
                      id="standard-basic"
                      label="PostalCode"
                      sx={textFieldStyles}
                      type="text"
                      variant="standard"
                      error={!!errors.postalCode}
                      {...register("postalCode", {
                        required: gpDetails === "yes" ? "PostalCode is required." : false,
                      })}
                      helperText={errors.postalCode?.message}
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded text-white flex items-center ml-2 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-700 transition-all duration-200"
                      disabled={btnZipCode}
                      onClick={() => {
                        setValue("addressOptions", []); // Clear previous address options
                        setValue("searchClicked", true);
                      }}
                    >
                      <span>Search</span>
                      <span className="ml-1.5 text-lg">
                        <BiSearchAlt />
                      </span>
                    </button>
                  </div>

                  {addressOptions.length > 0 && (
                    <div className="ml-1.5 w-1/2">
                      <FormControl fullWidth variant="standard" error={!!errors.addressSelect} sx={selectStyles}>
                        <InputLabel>Select Autofill</InputLabel>
                        <Select
                          variant="standard"
                          IconComponent={FaChevronDown}
                          fullWidth
                          {...register("addressSelect", {
                            required: "Please select an address",
                          })} // Validation for Select
                          onChange={(e) => handleSelect(e.target.value)}
                          defaultValue=""
                        >
                          {addressOptions.map((address, index) => (
                            <MenuItem key={index} value={index}>
                              {`${address.OrganisationName}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <TextField
                  id="standard-basic"
                  label="GP Name"
                  type="text"
                  sx={textFieldStyles}
                  variant="standard"
                  value={watch("gpName")}
                  {...register("gpName", {
                    required: gpDetails === "yes" && gepTreatMent === "yes" ? "GP Name is required." : false,
                  })}
                  error={!!errors.gpName}
                  helperText={errors.gpName?.message}
                />
              </div>

              <div className="mt-4 flex w-full gap-2 justify-between">
                <div className="w-1/2">
                  <TextField
                    id="standard-basic"
                    label="Addressline 1"
                    value={watch("addressLine1") || ""}
                    type="text"
                    sx={textFieldStyles}
                    variant="standard"
                    className="w-full"
                    {...register("addressLine1")}
                  />
                </div>
                <div className="w-1/2">
                  <TextField
                    id="standard-basic"
                    label="Addressline 2"
                    value={watch("addressLine2") || ""}
                    variant="standard"
                    className="w-full"
                    sx={textFieldStyles}
                    {...register("addressLine2")}
                  />
                </div>
              </div>
              <div className="mt-4 flex w-full gap-2 justify-between">
                <div className="w-1/2">
                  <TextField
                    id="standard-basic"
                    type="text"
                    label="County"
                    value={watch("state") || ""}
                    variant="standard"
                    className="w-full"
                    sx={textFieldStyles}
                    {...register("state")}
                  />
                </div>
                <div className="w-1/2">
                  <TextField
                    id="standard-basic"
                    type="text"
                    label="City"
                    value={watch("city") || ""}
                    variant="standard"
                    sx={textFieldStyles}
                    className="w-full"
                    {...register("city")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 sm:flex mb-10 hidden ">
            <BackButton label={"Back"} onClick={() => router.push("/step4")} />
            {/* <NextButton label={"Next"} disabled={!isValid || isLoading} loading={isLoading} /> */}
            <NextButton label={"Next"} disabled={!isValid} />
          </div>

          <div className="fixed bottom-2 w-[95%] mx-auto left-0 right-0 z-50 block sm:hidden">
            <div className="relative flex items-center bg-white/30 backdrop-blur-lg rounded-lg py-3 px-6 shadow-lg border border-white/40">
              {/* Content Layer (to prevent blur on buttons) */}
              <div className="relative flex w-full justify-between items-center">
                {/* Back Button */}
                <button
                  onClick={() => dispatch(prevStep())}
                  className="flex flex-col items-center justify-center text-white rounded-md bg-violet-700 p-3"
                >
                  <span className="text-md font-semibold px-6">Back</span>
                </button>

                {/* Proceed Button */}
                {/* <button
                type="submit"
                className={`p-3 flex flex-col items-center justify-center ${
                  !isValid || isLoading
                    ? "disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 text-white rounded-md"
                    : "text-white rounded-md bg-violet-700"
                }`}
              >
                {isLoading ? (
                  // Loading Spinner with Label
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span></span>
                  </div>
                ) : (
                  <span className="text-md font-semibold px-6">Next</span>
                )}
              </button> */}
                <button
                  type="submit"
                  className={`p-3 flex flex-col items-center justify-center ${
                    !isValid
                      ? "disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 text-white rounded-md"
                      : "text-white rounded-md bg-violet-700"
                  }`}
                >
                  <span className="text-md font-semibold px-6">Next</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StepperWrapper>
  );
}
export default Step5;
