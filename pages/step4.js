import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { nextStep, prevStep } from "../../store/slice/stepper";
// import DynamicRadioButton from "../DynamicCheckBox/DynamicCheckBox";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
// import { setStep4 } from "../../store/slice/stepSlice";
// import { usePostStepsMutation } from "../../store/services/Steps/Steps";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
import DynamicRadioButton from "@/Components/DynamicCheckBox/DynamicCheckBox";
import StepperWrapper from "@/layout/StepperWrapper";
import { useRouter } from "next/router";
import { setStep4 } from "@/store/steps";

export default function step4() {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change to "auto" for instant scrolling
    });
  }, []);

  const dispatch = useDispatch();
  //   const currentStep = useSelector((state) => state.step.currentStep);
  const [getQuestion, setGetQuestion] = useState(null);
  const [confirmationInfo, setconfirmationInfo] = useState(null);

  const step4Data = useSelector((state) => state.steps.step4);

  console.log(step4Data, "step4Data");

  //   const [postSteps, { error: isError, isLoading: loader }] = usePostStepsMutation();
  //   const pid = localStorage.getItem("pid");
  //   const stockPid = localStorage.getItem("p_id");

  // Initialize useForm
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // Enable live validation
  });

  // Watch checkbox state dynamically
  const isChecked = watch("confirmation_question");

  // Fetch Data from Local Storage
  useEffect(() => {
    console.log("THis is Effect");
    // const stepPrevData = localStorage.getItem("stepPrevApiData");
    if (step4Data) {
      // const dataParse = JSON.parse(stepPrevData);
      // console.log(dataParse, "dataParsesssss");
      const answer = Array.isArray(step4Data) ? step4Data[0]?.answer : null;
      console.log(answer, "answeeerrrrr From Inner");
      setGetQuestion(step4Data[0]); // Safe navigation

      if (answer == true) {
        setValue("confirmation_question", true);
      } else {
        setValue("confirmation_question", false);
      }
    }
    // const checkPrevData = localStorage.getItem("step4");
    if (step4Data) {
      // const dataParse = JSON.parse(checkPrevData);
      const dataParse = step4Data !== undefined && step4Data != "undefined" && step4Data ? step4Data : undefined;

      console.log(dataParse, "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

      if (dataParse[0].answer === true) {
        setValue("confirmation_question", true);
      } else {
        setValue("confirmation_question", false);
      }

      // console.log(isChecked, "isChecked");
    }
  }, []);
  //   const reorder_concent = localStorage.getItem("reorder_concent") || null;

  useEffect(() => {
    const updatedConfirmation = [
      {
        question: getQuestion?.qsummary,
        qsummary: getQuestion?.question,
        checklist: getQuestion?.checklist,
        answer: isChecked,
        has_checklist: getQuestion?.has_check_list ? getQuestion?.has_check_list : true,
      },
    ];
    setconfirmationInfo(updatedConfirmation); // Update state with the new value
    console.log(getQuestion, "getQuestion");
  }, [isChecked, getQuestion]);

  // Form submission handler
  const onSubmit = async (data) => {
    console.log(confirmationInfo, "confirmationInfooooooooo");
    dispatch(setStep4(confirmationInfo)); // Dispatch action to update step 4
    router.push("/step5");
    // try {
    //   const response = await postSteps({
    //     pid: pid || stockPid,
    //     confirmationInfo,
    //     reorder_concent: reorder_concent ? reorder_concent.toString() : null,
    //   }).unwrap();

    //   console.log(confirmationInfo, "confirmationInfooooooooo");

    //   dispatch(setStep4(confirmationInfo)); // Dispatch action to update step 4
    //   // dispatch(nextStep());
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <StepperWrapper>
      <div className="pb-20 sm:pb-0 px-12 my-8">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light">
            Step 4: <span className="font-bold">Consent</span>
          </h1>
        </div>
        <p className="text-[#6c757d] pt-3 text-sm lg:text-base mb-7">
          Your information is kept private and will be reviewed by a healthcare professional. The questions are meant to help the prescriber make an
          informed decision about the suitability of the treatment.
        </p>
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Dynamically Render Checkboxes */}
            {getQuestion && (
              <DynamicRadioButton
                key={getQuestion.question}
                name="confirmation_question" // Register with react-hook-form
                label={getQuestion.question}
                terms={getQuestion.checklist} // Pass raw HTML string
                register={register("confirmation_question", {
                  required: "You must confirm before proceeding.",
                })}
                isChecked={isChecked} // Pass watched state
              />
            )}

            {/* Validation Error Message */}
            {errors.confirmation_question && <p className="text-red-500 mt-2">{errors.confirmation_question.message}</p>}

            {/* Navigation Buttons */}
            {/* <div className="mt-10 flex justify-between">
            <div>
              <button
                type="button"
                onClick={() => dispatch(prevStep())}
                className="bg-violet-700 rounded-md px-4 py-2 shadow-md text-white"
              >
                <span className="flex items-center text-base">
                  <FaArrowLeft className="mr-1" /> Back
                </span>
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={!isValid} // Disable button until form is valid
                className={`bg-violet-700 border-gray-200 rounded-md px-4 py-2 shadow-md text-white ${!isValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <span className="flex items-center text-base">
                  Next <FaArrowRight className="ml-1" />
                </span>
              </button>
            </div>
          </div> */}

            <div className="mt-10 mb-10 hidden sm:flex">
              <BackButton label={"Back"} onClick={() => router.push("/step3")} />
              {/* <NextButton disabled={!isValid || loader} label={"Next"} loading={loader} /> */}
              <NextButton disabled={!isValid} label={"Next"} />
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
                  // onClick={() => dispatch(nextStep())}
                  disabled={!isValid || loader}
                  className={`p-3 flex flex-col items-center justify-center ${
                    !isValid || loader
                      ? "disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 text-white rounded-md"
                      : "text-white rounded-md bg-violet-700"
                  }`}
                >
                  {loader ? (
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
                    // onClick={() => dispatch(nextStep())}
                    disabled={!isValid}
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
      </div>
    </StepperWrapper>
  );
}
