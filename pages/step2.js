import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { nextStep, prevStep, triggerStep } from "../../store/slice/stepper";
// import { usePostStepsMutation } from "../../store/services/Steps/Steps";
import toast from "react-hot-toast";
import { setStep2 } from "@/store/steps";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
// import PrevButton from "../PrevBtn/PrevButton";
import { BsInfoCircle } from "react-icons/bs";
import StepperWrapper from "@/layout/StepperWrapper";
import { useRouter } from "next/router";

export default function step2() {
  const router = useRouter();
  const step2Data = useSelector((state) => state.steps.step2);

  const {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    trigger,
    clearErrors,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      heightFt: "",
      heightIn: "",
      weightStones: "",
      weightLbs: "",
      heightCm: "",
      weightKg: "",
      hiddenCm: "",
      hiddenKg: "",
      hiddenInch: "",
      hiddenLb: "",
      bmi: "",
      previously_taking_medicine: "",
      weight_related_comorbidity: "",
      weight_related_comorbidity_explanation: "",
      assian_message: "",
    },
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [lastConsultation, setLastConsultation] = useState(null);
  const [filledData, setFilledData] = useState(null);
  const [lastBmi, setLastBmi] = useState(null);
  //   const [prevStep1, setPrevStep1] = useState(null);
  //   const [prevStep2, setPrevStep2] = useState(null);
  const [preferNotToSay, setPreferNotToSay] = useState(false);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [someError, setSomeError] = useState("");
  // const [isNext, setIsNext] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [checkboxState, setCheckboxState] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  useEffect(() => {
    if (showMessage) {
      setValue(
        "assian_message",
        "As you have confirmed that you are from one of the following family backgrounds: South Asian, Chinese, other Asian, Middle Eastern, Black African, or African-Caribbean, your cardiometabolic risk occurs at a lower BMI. You are, therefore, able to proceed with a lower BMI."
      );
    }
  }, [showMessage, setValue]);
  const [nonOfTheAbove, setNonOfTheAbove] = useState(false);
  const [comorbidityExplanation, setComorbidityExplanation] = useState("");
  // get Data localStorage for step 1 and step 2
  //   const stepPrevApiData = useMemo(() => localStorage.getItem("stepPrevApiData"), []);
  //   const stepPrev = useMemo(() => localStorage.getItem("step1"), []);
  //   const stepPrev2 = useMemo(() => localStorage.getItem("step2"), []);

  useEffect(() => {
    if (step2Data) {
      //   const parsedData = JSON.parse(stepPrevApiData);
      //   const stepPrevParse = stepPrev !== undefined && stepPrev != "undefined" && stepPrev ? JSON.parse(stepPrev) : undefined;

      // const stepPrevParse = JSON.parse(stepPrev);
      //   const stepPrevParse2 = JSON.parse(stepPrev2);
      setLastConsultation(step2Data);
      setLastBmi(step2Data?.last_consultation_data?.bmi);
      setFilledData(step2Data?.last_consultation_data?.fields || step2Data?.last_consultation_data);
      // Set previous step data
      //   setPrevStep1(step2Data);
      //   setPrevStep2(step2Data);
    }
  }, [step2Data]);

  useEffect(() => {
    if (step2Data) {
      setPreferNotToSay(step2Data?.ethnicity === "yes" ? true : false);
    }
  }, [step2Data]);

  // };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setNonOfTheAbove(false);
    if (name === "checkbox1") {
      setValue(
        "previously_taking_medicine",
        checked ? ["You have previously taken weight loss medication your starting (baseline) BMI was above 30"] : ""
      );
    } else if (name === "checkbox2") {
      if (!checked) {
        setComorbidityExplanation("");
        setValue("weight_related_comorbidity_explanation", "");
        clearErrors("weight_related_comorbidity_explanation");
        trigger(); // :white_check_mark: Force RHF to re-evaluate form validity
      }
      setValue(
        "weight_related_comorbidity",
        checked
          ? [
              "You have at least one weight-related comorbidity (e.g. PCOS, diabetes, pre-diabetes, high cholesterol, hypertension, sleep apnoea, osteoarthritis etc.)",
            ]
          : ""
      );
    }
    setCheckboxState((prev) => ({ ...prev, [name]: checked }));
  };
  const handleNonOfTheAbove = (event) => {
    const { checked } = event.target;

    if (checked) {
      setComorbidityExplanation("");
      setValue("weight_related_comorbidity_explanation", "");
      setCheckboxState((prev) => ({
        ...prev,
        checkbox1: false,
        checkbox2: false,
      }));
    }
    setNonOfTheAbove(checked);
  };

  const isAtLeastOneCheckboxValid = () => {
    // If both checkboxes are selected but explanation is empty, return false
    if (checkboxState.checkbox1 && checkboxState.checkbox2 && comorbidityExplanation?.trim() === "") {
      return false;
    }

    // If at least one checkbox is selected, return true
    if (checkboxState.checkbox1 || checkboxState.checkbox2) {
      return true;
    }

    // Otherwise, return false
    return false;
  };

  useEffect(() => {
    const checkbox1Value = watch("previously_taking_medicine");
    const checkbox2Value = watch("weight_related_comorbidity");

    setCheckboxState({
      checkbox1: !!checkbox1Value,
      checkbox2: !!checkbox2Value,
    });
  }, [watch]);

  const handleExplanationChange = (event) => {
    const explanationValue = event.target.value.trim();

    setComorbidityExplanation(explanationValue);
    setValue("weight_related_comorbidity_explanation", explanationValue);
  };

  useEffect(() => {
    const getInStockPid = localStorage.getItem("p_id");

    if (step2Data) {
      setValue("heightFt", step2Data?.ft || "");
      setValue("heightIn", step2Data?.inch || "");
      if (getInStockPid) {
        setValue("weightStones", step2Data?.stones || "");
        setValue("weightLbs", step2Data?.pound || "");
      } else {
        setValue("weightStones", "");
        setValue("weightLbs", "");
      }
      // lastBmi?.stones ||

      //  lastBmi?.pound ||
      setValue("weightKg", step2Data?.kg || "");
      setValue("heightCm", step2Data?.cm || "");
      setValue("bmi", step2Data?.bmi || "");
      // hidden
      setValue("hiddenInch", step2Data?.inch || "");
      setValue("hiddenCm", step2Data?.cm || "");
      setValue("hiddenLb", step2Data?.pound || "");
      setValue("hiddenKg", step2Data?.kg || "");
      setValue("previously_taking_medicine", step2Data?.previously_taking_medicine || "");
      setValue("weight_related_comorbidity", step2Data?.weight_related_comorbidity || "");
      setValue("weight_related_comorbidity_explanation", step2Data?.weight_related_comorbidity_explanation || "");
      trigger("bmi");
      trigger("heightFt");
      trigger("heightIn");
      trigger("weightStones");
      trigger("weightLbs");
      trigger("heightCm");
      trigger("weightKg");
      trigger("previously_taking_medicine");
      trigger("weight_related_comorbidity");
      trigger("weight_related_comorbidity_explanation");
    }
  }, [step2Data, setValue, trigger]);

  const dispatch = useDispatch();
  //   const currentStep = useSelector((state) => state.step.currentStep);
  const [unit, setUnit] = useState("imperial");
  const [bmi, setBmi] = useState(0);
  const [minimumBmi, setMinimunBmi] = useState("");
  const watchFields = watch();
  const calculateBMI = () => {
    let bmiValue = 0;
    if (unit === "metrics") {
      const heightInMeters = parseFloat(watchFields.heightCm || 0) / 100;
      const weightInKg = parseFloat(watchFields.weightKg || 0);

      if (heightInMeters > 0 && weightInKg > 0) {
        bmiValue = weightInKg / (heightInMeters * heightInMeters);
      }
    } else {
      const totalHeightInInches = parseFloat(watchFields.heightFt || 0) * 12 + parseFloat(watchFields.heightIn || 0);
      const weightInPounds = parseFloat(watchFields.weightStones || 0) * 14 + parseFloat(watchFields.weightLbs || 0);

      if (totalHeightInInches > 0 && weightInPounds > 0) {
        bmiValue = (weightInPounds / totalHeightInInches ** 2) * 703;
      }
    }

    // Ensure rounding consistency across both metric and imperial modes
    bmiValue = parseFloat(bmiValue.toFixed(1));
    if (!bmiValue || isNaN(bmiValue)) {
      // setErrorMessage("Invalid BMI calculation. Please check your inputs.");
      setShowCheckBox(false);
      setShowMessage(false);
      // setIsNext(false); // Disable button
      return;
    }

    setBmi(bmiValue);
    setErrorMessage("");
    console.log(lastConsultation?.isReturning, "lastConsultation?.isReturning");
    // Determine minimum BMI based on conditions
    let minBmi = 0;
    if (lastConsultation?.isReturning) {
      // Returning old patient
      minBmi = 20;
    } else if (!lastConsultation?.isReturning && preferNotToSay) {
      // New patient, prefer not to say
      minBmi = 25.5;
    } else if (!lastConsultation?.isReturning && !preferNotToSay) {
      // New patient, no preference
      minBmi = 27;
    } else {
      setErrorMessage("Invalid condition encountered.");
      setShowCheckBox(false);
      setShowMessage(false);
      // setIsNext(false); // Disable button
      return;
    }

    // Validate BMI against ranges and handle messages
    if (bmiValue < minBmi) {
      setErrorMessage(`BMI must be at least ${minBmi}`);
      setShowCheckBox(false);
      setShowMessage(false);
      setSomeError(
        "Your BMI is approaching the lower end of healthy weight. Due to the risk of becoming underweight, you are not able to proceed. Please arrange a telephone consultation with a member of our clinical team to discuss alternatives."
      );
      // setIsNext(false);
    } else if (bmiValue >= minBmi && bmiValue <= 27.4) {
      if (!lastConsultation?.isReturning) {
        setShowCheckBox(true);
        setShowMessage(false);
        // setIsNext((showCheckBox && isAtLeastOneCheckboxChecked())); // Enable button if at least one checkbox is checked
      }
    } else if (bmiValue >= 27.4 && bmiValue <= 29.9) {
      if (!lastConsultation?.isReturning && preferNotToSay) {
        setShowCheckBox(false);
        setShowMessage(true);
        setMinimunBmi(27);
        // setIsNext(false);
      } else if (!lastConsultation?.isReturning && !preferNotToSay) {
        setShowCheckBox(true);
        setShowMessage(false);
        setMinimunBmi(30);
        // setIsNext((showCheckBox && !isAtLeastOneCheckboxChecked())); // Enable button if at least one checkbox is checked
      } else {
        setShowCheckBox(false);
        setShowMessage(false);
      }
    } else {
      setShowCheckBox(false);
      setShowMessage(false);
      // setIsNext(true); // Enable button for valid BMI
    }
  };

  // Call calculateBMI when necessary
  useEffect(() => {
    calculateBMI();
  }, [lastConsultation, preferNotToSay]);

  // 13 31 92  86   6 11 17 17
  useEffect(() => {
    const savedUnit = localStorage.getItem("unit") || "imperial";
    setUnit(savedUnit);
  }, []);

  // Convert Imperial to Metric dynamically
  const updateMetric = () => {
    const heightFt = parseFloat(getValues("heightFt")) || 0;
    const heightIn = parseFloat(getValues("heightIn")) || 0;
    const weightStones = parseFloat(getValues("weightStones")) || 0;
    const weightLbs = parseFloat(getValues("weightLbs")) || 0;

    // Exact conversions
    const totalInches = heightFt * 12 + heightIn;
    const heightInCm = totalInches * 2.54;
    const totalLbs = weightStones * 14 + weightLbs;
    const weightInKg = totalLbs * 0.453592;
    setValue("hiddenCm", heightInCm);
    setValue("hiddenKg", weightInKg);
    setValue("heightCm", Math.round(heightInCm));
    setValue("weightKg", Math.round(weightInKg));
  };

  // Convert Metric to Imperial dynamically
  const updateImperial = () => {
    const heightCm = parseFloat(getValues("heightCm")) || 0;
    const weightKg = parseFloat(getValues("weightKg")) || 0;

    // Exact conversions
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    const totalLbs = weightKg * 2.20462;
    const stones = Math.floor(totalLbs / 14);
    const lbs = totalLbs % 14;

    // Store precise values (hidden fields)
    setValue("hiddenInches", totalInches.toFixed(5));
    setValue("hiddenLbs", totalLbs.toFixed(5));

    // Display rounded values
    setValue("heightFt", feet);
    setValue("heightIn", Math.round(inches));
    setValue("weightStones", stones);
    setValue("weightLbs", Math.round(lbs));
  };

  useEffect(() => {
    if (unit === "imperial") updateMetric();
    else updateImperial();

    calculateBMI();
  }, [watchFields.heightFt, watchFields.heightIn, watchFields.weightStones, watchFields.weightLbs, watchFields.heightCm, watchFields.weightKg]);

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
    localStorage.setItem("unit", selectedUnit);
  };

  //   const [postSteps, { isLoading, error }] = usePostStepsMutation();
  //   const getPid = localStorage.getItem("pid");
  //   const stockPid = localStorage.getItem("p_id");

  const onSubmit = async (data) => {
    const reorderStatus = JSON.parse(localStorage.getItem("reorder_concent"));

    console.log("This is onSubmit");

    const BMI = {
      unit: unit,
      ft: data.heightFt,
      inch: data.heightIn,
      stones: data.weightStones,
      pound: data.weightLbs,
      meter: data.breastFeeding,
      cm: data.heightCm,
      kg: data.weightKg,
      bmi: bmi,
      hiddenInch: data.heightIn,
      hiddenLb: data.weightLbs,
      hiddenCm: data.heightCm,
      hiddenKg: data.weightKg,
      bmiConsent: {
        previously_taking_medicine: data.previously_taking_medicine,
        weight_related_comorbidity: data.weight_related_comorbidity,
        weight_related_comorbidity_explanation: data.weight_related_comorbidity_explanation,
        assian_message:
          showMessage === true
            ? "As you have confirmed that you are from one of the following family backgrounds: South Asian, Chinese, other Asian, Middle Eastern, Black African, or African-Caribbean, your cardiometabolic risk occurs at a lower BMI. You are, therefore, able to proceed with a lower BMI."
            : "",
      },
      ethnicity: "",
    };

    dispatch(setStep2(BMI));
    router.push("/step3");
    // try {
    //   const response = await postSteps({
    //     bmi: BMI,
    //     pid: getPid || stockPid,
    //   }).unwrap();

    //   if (response?.status === true) {
    //     dispatch(setStep2(BMI));

    //     if (reorderStatus === false) {
    //       dispatch(triggerStep(7));
    //       return;
    //     }
    //     if (reorderStatus === true) {
    //       dispatch(nextStep());
    //     } else {
    //       dispatch(nextStep());
    //       return;
    //     }
    //   } else {
    //     toast.error("Invalid login response");
    //   }
    // } catch (err) {
    //   const errors = err?.data?.errors;
    //   if (errors && typeof errors === "object") {
    //     Object.keys(errors).forEach((key) => {
    //       const errorMessage = errors[key];
    //       Array.isArray(errorMessage) ? errorMessage.forEach((msg) => toast.error(msg)) : toast.error(errorMessage);
    //     });
    //   } else {
    //     toast.error("An unexpected error occurred.");
    //   }
    // }
  };

  useEffect(() => {
    if (step2Data) {
      setPreferNotToSay(step2Data?.ethnicity === "yes");
    }
  }, [step2Data]);

  return (
    <StepperWrapper>
      <section className="pb-20 sm:pb-0 px-12 my-8">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light mb-3">
            Step 2: <span className="font-bold">BMI Details</span>
          </h1>
        </div>

        <div className="grid grid-cols-12">
          <div className="sm:col-span-6 col-span-full">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-0 sm:pe-5 space-y-6 overflow-y-auto">
              <p className="text-md text-gray-500 pt-3">
                What units do you want to use? <span className="text-red-500">*</span>
              </p>
              <Box className="flex sm:justify-start justify-evenly gap-4 items-center">
                {/* Imperial Button */}
                <Box
                  onClick={() => handleUnitChange("imperial")}
                  className={`sm:w-3/4   w-32 cursor-pointer flex items-center justify-between px-6 py-3 rounded-lg transition duration-300 shadow-md ${
                    unit === "imperial"
                      ? "border-2 border-green-500 bg-green-50 text-green-600 shadow-lg"
                      : "border border-gray-100 bg-white text-gray-800 hover:shadow"
                  }`}
                >
                  <span className="text-sm font-bold">IMPERIAL</span>
                  {unit === "imperial" && (
                    <span className="ml-2 flex items-center justify-center p-1 sm:w-5 h-5 rounded-full sm:bg-green-200 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-3 h-3" viewBox="0 0 16 16">
                        <path d="M13.485 1.929a1 1 0 0 1 1.415 1.415l-8 8a1 1 0 0 1-1.415 0l-4-4a1 1 0 1 1 1.415-1.415L6.5 9.086l6.985-6.985z" />
                      </svg>
                    </span>
                  )}
                </Box>

                {/* Metric Button */}
                <Box
                  onClick={() => handleUnitChange("metrics")}
                  className={`sm:w-3/4 w-32 cursor-pointer flex items-center justify-between px-6 py-3 rounded-lg transition duration-300 shadow-md ${
                    unit === "metrics"
                      ? "border-2 border-green-500 bg-green-50 text-green-600 shadow-lg"
                      : "border border-gray-300 bg-white text-gray-800 hover:shadow"
                  }`}
                >
                  <span className="text-sm font-bold">METRICS</span>
                  {unit === "metrics" && (
                    <span className="ml-2 flex items-center justify-center p-1 sm:w-5 h-5 rounded-full sm:bg-green-200 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-3 h-3" viewBox="0 0 16 16">
                        <path d="M13.485 1.929a1 1 0 0 1 1.415 1.415l-8 8a1 1 0 0 1-1.415 0l-4-4a1 1 0 1 1 1.415-1.415L6.5 9.086l6.985-6.985z" />
                      </svg>
                    </span>
                  )}
                </Box>
              </Box>

              {unit === "imperial" ? (
                <>
                  <div className="pt-3 text-[#1C1C29] reg-font">
                    <label htmlFor=""> What is your height?*</label>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <TextField
                        type="text"
                        inputMode="numeric"
                        variant="standard"
                        label="ft"
                        value={watch("heightFt") || ""}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          const val = parseInt(e.target.value, 10);
                          if (val > 10) e.target.value;
                          if (val < 1 && e.target.value !== "") e.target.value = "1";
                        }}
                        {...register("heightFt", {
                          required: true,
                          pattern: {
                            value: /^(?:[1-9]|10)$/, // allows only numbers 1 to 10
                            message: "Only numbers from 1 to 10 are allowed",
                          },
                        })}
                        error={!!errors.heightFt}
                        helperText={errors.heightFt?.message || ""}
                      />
                    </div>
                    <div className="col-span-6">
                      <TextField
                        type="text"
                        inputMode="numeric"
                        variant="standard"
                        label="inches"
                        value={watch("heightIn") || ""}
                        onInput={(e) => {
                          // Strip all non-numeric characters
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          // Clamp value between 0 and 11
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value)) {
                            if (value > 11) e.target.value;
                            if (value < 0) e.target.value = "0";
                          }
                        }}
                        {...register("heightIn", {
                          required: "Height is required",
                          pattern: {
                            value: /^(?:[0-9]|10|11)$/, // allows 0 to 11 only
                            message: "Only valid numbers (0–11) are allowed",
                          },
                        })}
                        error={!!errors.heightIn}
                        helperText={errors.heightIn?.message || ""}
                      />
                    </div>
                  </div>

                  <div className="pt-3 text-[#1C1C29] reg-font">
                    <label htmlFor=""> What is your Weight?*</label>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <TextField
                        id="weightStones"
                        variant="standard"
                        label="stones"
                        type="text"
                        fullWidth
                        inputMode="numeric"
                        value={watch("weightStones") || ""}
                        onInput={(e) => {
                          // Strip non-digits
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          // Prevent typing above 500
                          if (e.target.value.length > 0) {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value > 80) {
                              e.target.value;
                            }
                          }
                        }}
                        {...register("weightStones", {
                          required: "Weight is required",
                          pattern: {
                            value: /^(?:[4-9]|[1-7][0-9]|80)$/,
                            message: "Only valid numbers (4–80) are allowed",
                          },
                        })}
                        error={!!errors.weightStones}
                        helperText={errors.weightStones?.message || ""}
                      />
                      {/* <TextField
                  type="text" // Use text to manually restrict input
                  inputMode="numeric" // Shows number pad on mobile
                  variant="standard"
                  label="stones"
                  value={watch("weightStones") || ""}
                  onInput={(e) => {
                    // Remove all non-numeric characters
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");

                    // Clamp value between 4 and 80
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      if (value > 80) e.target.value = "80";
                      if (value < 4) e.target.value = "4";
                    }
                  }}
                  {...register("weightStones", {
                    required: true,
                    pattern: {
                      value: /^(?:[4-9]|[1-7][0-9]|80)$/, // allows only 4 to 80
                      message: "Only valid numbers (4–80) are allowed",
                    },
                  })}
                  error={!!errors.weightStones}
                  helperText={errors.weightStones?.message || ""}
                /> */}

                      {/* <TextField
                  type="number"
                  variant="standard"
                  label="stones"
                  value={watch("weightStones") || ""}
                  onInput={(e) => {
                    if (e.target.value > 80) {
                      e.target.value = 80;
                    }
                    if (e.target.value < 0) {
                      e.target.value = 0;
                    }
                  }}
                  {...register("weightStones", {
                    required: true,
                    pattern: {
                      value: /^[1-9][0-9]*$/,
                      message: "Only valid numbers are allowed",
                    },
                    min: {
                      value: 4,
                      message: "Stones must be greater than or equal to 4",
                    },
                    max: {
                      value: 80,
                      message: "Stones must be less than or equal to 80",
                    },
                  })}
                  error={!!errors.weightStones}
                  helperText={errors.weightStones ? errors.weightStones.message : ""}
                /> */}
                    </div>

                    <div className="col-span-6">
                      <TextField
                        type="text" // Full control over input
                        inputMode="numeric" // Triggers numeric keypad on mobile
                        variant="standard"
                        label="lbs"
                        value={watch("weightLbs") || ""}
                        onInput={(e) => {
                          // Remove non-numeric characters
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value)) {
                            if (value > 20) e.target.value;
                          }
                        }}
                        {...register("weightLbs", {
                          required: true,
                          pattern: {
                            value: /^(0|[1-9]|1[0-9]|20)$/, // ✅ Allows 0–20 only
                            message: "Only valid numbers (0–20) are allowed",
                          },
                        })}
                        error={!!errors.weightLbs}
                        helperText={errors.weightLbs?.message || ""}
                      />

                      {/* <TextField
                  type="number"
                  variant="standard"
                  label="lbs"
                  value={watch("weightLbs") || ""}
                  onInput={(e) => {
                    const value = Number(e.target.value);
                    if (value > 20) {
                      e.target.value = 20;
                    }
                    if (value < 0) {
                      e.target.value = 0;
                    }
                  }}
                  {...register("weightLbs", {
                    required: true,
                    pattern: {
                      value: /^(0|[1-9][0-9]*)$/, // ✅ Allows 0 and positive numbers
                      message: "Only valid numbers are allowed",
                    },
                    minLength: {
                      value: 1,
                      message: "pound must have at least 1 digit",
                    },
                    maxLength: {
                      value: 2,
                      message: "pound must have a maximum of 2 digits",
                    },
                    min: {
                      value: 0, // ✅ Updated to allow 0
                      message: "pound must be greater than or equal to 0",
                    },
                    max: {
                      value: 20,
                      message: "pound must be less than or equal to 20",
                    },
                  })}
                  error={!!errors.weightLbs}
                  helperText={errors.weightLbs ? errors.weightLbs.message : ""}
                /> */}
                    </div>
                  </div>

                  {/* // </Box> */}
                </>
              ) : (
                <div className="">
                  <div className="w-full sm:max-w-56">
                    {/* Height Section */}
                    <div className="col-span-6 my-10">
                      <label htmlFor="heightCm" className="block text-[#1C1C29] font-medium mb-2">
                        What is your height?*
                      </label>
                      {/* <TextField
                  id="heightCm"
                  variant="standard"
                  label="cm"
                  type="number"
                  fullWidth
                  inputProps={{
                    inputMode: "numeric",
                    min: "1",
                    max: "300",
                    pattern: "[0-9]*",
                  }}
                  value={watch("heightCm") || ""}
                  onInput={(e) => {
                    if (e.target.value > 300) {
                      e.target.value = 300;
                    }
                    if (e.target.value < 0) {
                      e.target.value = 0;
                    }
                  }}
                  {...register("heightCm", {
                    required: "Height is required",
                    min: {
                      value: 1,
                      message: "Height must be at least 1 cm",
                    },
                    max: {
                      value: 300,
                      message: "Height cannot exceed 300 cm",
                    },
                    validate: (value) => /^[1-9][0-9]{0,2}$/.test(value) || "Only whole numbers are allowed",
                  })}
                  error={!!errors.heightCm}
                  helperText={errors.heightCm?.message || ""}
                /> */}

                      <TextField
                        id="heightCm"
                        variant="standard"
                        label="cm"
                        type="text" // use text for full control
                        fullWidth
                        inputMode="numeric" // triggers number pad on mobile
                        value={watch("heightCm") || ""}
                        onInput={(e) => {
                          // Remove anything that's not a digit
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            if (val > 300) e.target.value;
                            if (val < 1) e.target.value = "1";
                          }
                        }}
                        {...register("heightCm", {
                          required: "Height is required",
                          pattern: {
                            value: /^(?:[1-9]|[1-9][0-9]|[1-2][0-9]{2}|300)$/, // Matches 1–300
                            message: "Only whole numbers from 1 to 300 are allowed",
                          },
                        })}
                        error={!!errors.heightCm}
                        helperText={errors.heightCm?.message || ""}
                      />
                    </div>

                    {/* Weight Section */}
                    <div className="col-span-6">
                      <label htmlFor="weightKg" className="block text-[#1C1C29] font-medium mb-2">
                        What is your current weight?*
                      </label>

                      <TextField
                        id="weightKg"
                        variant="standard"
                        label="kg"
                        type="text"
                        fullWidth
                        inputMode="numeric"
                        value={watch("weightKg") || ""}
                        onInput={(e) => {
                          // Strip non-digits
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");

                          // Prevent typing above 500
                          if (e.target.value.length > 0) {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value > 500) {
                              e.target.value;
                            }
                          }
                        }}
                        {...register("weightKg", {
                          required: "Weight is required",
                          pattern: {
                            value: /^(4[0-9]|[5-9][0-9]|[1-4][0-9]{2}|500)$/, // 40–500 only
                            message: "Only whole numbers from 40 to 500 are allowed",
                          },
                        })}
                        error={!!errors.weightKg}
                        helperText={errors.weightKg?.message || ""}
                      />

                      {/* <TextField
                  id="weightKg"
                  variant="standard"
                  label="kg"
                  type="number"
                  fullWidth
                  inputProps={{
                    inputMode: "numeric",
                    min: "40",
                    max: "500",
                    pattern: "[0-9]*",
                  }}
                  value={watch("weightKg") || ""}
                  onInput={(e) => {
                    if (e.target.value > 500) {
                      e.target.value = 500;
                    }
                    if (e.target.value < 0) {
                      e.target.value = 0;
                    }
                  }}
                  {...register("weightKg", {
                    required: "Weight is required",
                    min: {
                      value: 40,
                      message: "Weight must be at least 40 kg",
                    },
                    max: {
                      value: 500,
                      message: "Weight cannot exceed 500 kg",
                    },
                    validate: (value) => /^[1-9][0-9]{0,2}$/.test(value) || "Only whole numbers are allowed",
                  })}
                  error={!!errors.weightKg}
                  helperText={errors.weightKg?.message || ""}
                /> */}
                    </div>
                  </div>
                </div>
              )}
              {showMessage && (
                <Box className="p-4 border rounded bg-yellow-100 mt-4">
                  <Typography variant="body1">
                    As you have confirmed that you are from one of the following family backgrounds: South Asian, Chinese, other Asian, Middle
                    Eastern, Black African, or African-Caribbean, your cardiometabolic risk occurs at a lower BMI. You are, therefore, able to proceed
                    with a lower BMI.
                  </Typography>
                </Box>
              )}
              <Box>
                {showCheckBox && (
                  <Box>
                    {!lastConsultation?.isReturning && !preferNotToSay && (
                      <>
                        <p className="font-sans font-normal text-md text-gray-900">
                          Your BMI is between <span className="font-bold">27-29.9 </span>which indicates you are overweight.
                        </p>
                      </>
                    )}
                    <div className="my-2">
                      <p className="font-sans font-normal text-md text-gray-950">
                        You should only continue with the consultation if you have tried losing weight through a reduced-calorie diet and increased
                        physical activity but are still struggling to lose weight and confirm that either:
                      </p>
                    </div>

                    {/* Checkbox 1 */}
                    <Box mb={3} className="mx-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkboxState.checkbox1}
                            onChange={handleCheckboxChange}
                            name="checkbox1"
                            icon={
                              <span className=" w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center ">
                                <span className="hidden"></span> {/* Hidden by default */}
                              </span>
                            }
                            checkedIcon={
                              <span className="w-4 h-4 rounded-full bg-violet-700 border-2 border-violet-700 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            }
                            className="cursor-pointer hover:scale-105 transition-transform duration-200 "
                          />
                        }
                        label={`You have previously taken weight loss medication your starting (baseline) BMI was above ${minimumBmi}`}
                        classes={{ label: "ml-2 font-medium text-gray-800" }}
                      />
                    </Box>

                    {/* Checkbox 2 */}
                    <Box mb={3} className="mx-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkboxState.checkbox2}
                            onChange={handleCheckboxChange}
                            name="checkbox2"
                            icon={
                              <span className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                <span className="hidden"></span>
                              </span>
                            }
                            checkedIcon={
                              <span className="w-4 h-4 rounded-full bg-violet-700 border-2 border-violet-700 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            }
                            className="cursor-pointer hover:scale-105 transition-transform duration-200"
                          />
                        }
                        label="You have at least one weight-related comorbidity (e.g. PCOS, diabetes, pre-diabetes, high cholesterol, hypertension, sleep apnoea, osteoarthritis etc.)"
                      />
                    </Box>

                    {/* Explanation TextArea for Checkbox 2 */}
                    {checkboxState.checkbox2 && (
                      <Box mb={3} className="mx-1">
                        <Controller
                          name="weight_related_comorbidity_explanation"
                          control={control}
                          rules={{
                            required: "Explanation is required when Weight related comorbidity is selected",
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              onChange={handleExplanationChange}
                              label="Explanation"
                              fullWidth
                              multiline
                              rows={4}
                              error={!!errors.weight_related_comorbidity_explanation}
                              helperText={errors.weight_related_comorbidity_explanation ? errors.weight_related_comorbidity_explanation.message : ""}
                              variant="outlined"
                              className="border-2 border-gray-300 p-2 rounded-xl "
                            />
                          )}
                        />
                      </Box>
                    )}

                    <Box mb={3} className="mx-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={nonOfTheAbove}
                            onChange={handleNonOfTheAbove}
                            name="checkbox1"
                            icon={
                              <span className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                <span className="hidden"></span> {/* Hidden by default */}
                              </span>
                            }
                            checkedIcon={
                              <span className="w-4 h-4 rounded-full bg-violet-700 border-2 border-violet-700 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            }
                            className="cursor-pointer hover:scale-105 transition-transform duration-200"
                          />
                        }
                        label={"Non of the above"}
                        classes={{ label: "ml-2 font-medium text-gray-800" }}
                      />
                      <p className="text-red-600 font-normal  text-sm">
                        {nonOfTheAbove
                          ? "Your BMI in this range, weight loss treatment can only be prescribed if you have either previously taken weight loss medication, or your have at least one weight-related medical condition."
                          : false}
                      </p>
                    </Box>
                  </Box>
                )}
              </Box>

              {filledData?.bmi != null ? (
                filledData?.bmi?.stones != null && filledData?.bmi?.unit === "imperial" && filledData?.bmi?.stones !== "" ? (
                  <div
                    id="alert-border-4"
                    className="flex items-center p-4 mb-4 text-yellow-900 border-t-4 border-yellow-500 bg-yellow-100"
                    role="alert"
                  >
                    <BsInfoCircle size={18} className="font-extrabold" />
                    <div className="ms-3 text-xs sm:text-sm font-medium">
                      Your previous recorded weight was <strong>{`${filledData?.bmi?.stones} st & ${filledData?.bmi?.pound} lbs`}</strong>
                    </div>
                  </div>
                ) : (
                  <div
                    id="alert-border-4"
                    className="flex items-center p-4 mb-4 text-yellow-900 border-t-4 border-yellow-500 bg-yellow-100"
                    role="alert"
                  >
                    <BsInfoCircle size={18} className="font-extrabold" />
                    <div className="ms-3 text-xs sm:text-sm font-medium">
                      Your previous recorded weight was <strong>{`${filledData?.bmi?.kg} kg`}</strong>
                    </div>
                  </div>
                )
              ) : (
                ""
              )}

              <div className="block sm:hidden">
                <div
                  className={`mt-2 text-center bg-gray-100 p-8 w-full rounded-md transition-colors duration-300 ease-in-out select-none ${
                    lastConsultation?.isReturning
                      ? bmi == 0
                        ? "bg-gray-100"
                        : bmi < 18.5
                        ? "bg-red-300"
                        : bmi > 18.5 && bmi <= 26.9
                        ? "bg-yellow-100"
                        : bmi > 26.9 && bmi <= 30
                        ? "bg-green-300"
                        : "bg-[#4DB581]"
                      : bmi == 0
                      ? "bg-gray-100"
                      : bmi < 30
                      ? "bg-red-300"
                      : bmi >= 30
                      ? "bg-yellow-100"
                      : bmi > 27 && bmi <= 29.9
                      ? "bg-green-300"
                      : "bg-[#4DB581]"
                  }`}
                >
                  <div className="bmi-value | font-semibold text-lg">BMI Value</div>
                  <p className="text-4xl text-black font-semibold">{parseFloat(bmi).toFixed(1)}</p>
                </div>
              </div>
              {/* <PrevButton label={"Back"} onClick={() => dispatch(prevStep())} /> */}
              <div className="mt-10 hidden sm:flex">
                <BackButton label={"Back"} onClick={() => router.push("/step1")} />
                {/* <NextButton
                disabled={errorMessage || isLoading || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())}
                label={"Next"}
                loading={isLoading}
              /> */}
                <NextButton disabled={errorMessage || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())} label={"Next"} />
              </div>
              <div className="fixed bottom-2 w-[95%] mx-auto left-0 right-0 z-50 block sm:hidden">
                <div className="relative flex justify-between items-center bg-white/30 backdrop-blur-lg rounded-lg py-3 px-6 shadow-lg border border-white/40">
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
                    disabled={errorMessage || isLoading || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())}
                    className={`p-3 flex flex-col items-center justify-center ${
                      errorMessage || isLoading || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())
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
                      disabled={errorMessage || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())}
                      className={`p-3 flex flex-col items-center justify-center ${
                        errorMessage || !isValid || (showCheckBox && !isAtLeastOneCheckboxValid())
                          ? "disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 rounded-md"
                          : " rounded-md bg-violet-700"
                      }`}
                    >
                      <span className="text-md font-semibold px-6">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="sm:col-span-6 col-span-full mt-0 sm:mt-[45px]">
            <div className="right | w-full lg:w-full">
              <div className="hidden sm:block">
                <div
                  className={`ml-8 text-center bg-gray-100 p-8 w-full rounded-md transition-colors duration-300 ease-in-out select-none ${
                    lastConsultation?.isReturning
                      ? bmi == 0
                        ? "bg-gray-100"
                        : bmi < 18.5
                        ? "bg-red-300"
                        : bmi > 18.5 && bmi <= 26.9
                        ? "bg-yellow-100"
                        : bmi > 26.9 && bmi <= 30
                        ? "bg-green-300"
                        : "bg-[#4DB581]"
                      : bmi == 0
                      ? "bg-gray-100"
                      : bmi < 30
                      ? "bg-red-300"
                      : bmi >= 30
                      ? "bg-yellow-100"
                      : bmi > 27 && bmi <= 29.9
                      ? "bg-green-300"
                      : "bg-[#4DB581]"
                  }`}
                >
                  <div className="bmi-value | font-semibold text-lg">BMI Value</div>
                  <p className="text-4xl text-black font-semibold">{parseFloat(bmi).toFixed(1)}</p>
                </div>
              </div>
              <div className="text-center my-3">
                {errorMessage && lastConsultation?.isReturning === false && (
                  <div
                    id="alert-border-4"
                    className="flex items-center p-4 sm:mb-4 text-red-600 border-t-4  bg-red-50  border-red-600 rounded-md mb-30 sm:ml-8 w-full"
                    role="alert"
                  >
                    <svg
                      className="flex-shrink-0 w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div className="ms-3 text-sm font-medium">
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
              {someError && errorMessage && lastConsultation?.isReturning === true && (
                <>
                  <div
                    id="alert-border-4"
                    className="flex items-center p-4 mb-4 text-red-600 border-t-4 bg-red-50  border-red-600 rounded-md mb-30 w-full ml-8"
                    role="alert"
                  >
                    <div className="ms-3 text-sm font-medium">
                      <p>{someError}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Hidden Fields for Accurate Calculation */}
              <input type="hidden" {...register("hiddenCm")} />
              <input type="hidden" {...register("hiddenKg")} />
              <input type="hidden" {...register("hiddenInches")} />
              <input type="hidden" {...register("hiddenLbs")} />
            </div>
          </div>
        </div>

        {/* </div > */}
      </section>
    </StepperWrapper>
  );
}
