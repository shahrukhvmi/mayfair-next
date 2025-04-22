import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { nextStep, prevStep } from "../../store/slice/stepper";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
import dayjs from "dayjs";
import StepperWrapper from "@/layout/StepperWrapper";
import { useRouter } from "next/router";

function Step6() {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change to "auto" for instant scrolling
    });
  }, []);
  const step1Data = useSelector((state) => state.steps.step1);
  const step2Data = useSelector((state) => state.steps.step2);
  const step3Data = useSelector((state) => state.steps.step3);
  const step4Data = useSelector((state) => state.steps.step4);
  const step5Data = useSelector((state) => state.steps.step5);

  const dispatch = useDispatch();
  //   const currentStep = useSelector((state) => state.step.currentStep);
  const [steps, setStepsData] = useState({
    step1: step1Data,
    step2: step2Data,
    step3: step3Data,
    step4: step4Data,
    step5: step5Data,
  });
  // const [prev, setPrevData] = useState(null);
  // Load all steps data and previous step API data
  useEffect(() => {
    const loadStepsData = () => {
      const stepKeys = ["step1", "step2", "step3", "step4", "step5"];
      const data = {};

      stepKeys.forEach((step) => {
        const storedData = localStorage.getItem(step);
        data[step] = storedData !== undefined && storedData != "undefined" && storedData ? JSON.parse(storedData) : undefined;
        // storedData !== undefined && storedData != "undefined" && storedData ? JSON.parse(storedData) : undefined;
      });

      setStepsData(data); // Update state with loaded steps data
      console.log(data);
    };

    // const stepPrevApiData = localStorage.getItem("stepPrevApiData");
    // const parsedData = stepPrevApiData ? JSON.parse(stepPrevApiData) : null;

    // setPrevData(parsedData?.last_consultation_data || null);

    loadStepsData(); // Load steps data into state
  }, []);

  return (
    <>
      <StepperWrapper>
        <section className="pb-20 sm:pb-0 px-12 my-8">
          <center>
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light capitalize mb-10">
              <span className="font-bold"> Consultation Form Summary</span>
            </h1>
          </center>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">General Information:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">Patient Name</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">
                  {steps?.step1?.firstName} <span></span>
                  {steps?.step1?.lastName}
                </p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">Patient’s Postcode*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">{steps?.step1?.address?.postalcode}</p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">Are you male or female?*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">{steps?.step1?.gender}</p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">What is your date of birth?*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">
                  {steps?.step1?.dob ? dayjs(steps.step1.dob).format("DD-MM-YYYY") : ""}
                </p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">What is your height?*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">
                  {steps?.step2?.unit === "imperial" ? (
                    <>
                      {" "}
                      {steps.step2?.ft} ft {steps.step2?.inch} inch{" "}
                    </>
                  ) : (
                    <>{steps.step2?.cm} cm</>
                  )}
                </p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">What is your weight?*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">
                  {steps?.step2?.unit === "imperial" ? (
                    <>
                      {steps.step2?.stones} st {steps.step2?.pound} lb
                    </>
                  ) : (
                    <>{steps.step2?.kg} kg</>
                  )}
                </p>
              </div>

              <div className="p-4 bg-white border rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900 capitalize">Your BMI*</p>
                <p className="text-base font-semibold text-gray-900 mt-2 capitalize">{steps.step2?.bmi}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">Medical Information:</h3>
            {steps?.step3?.map((item, index) => (
              <div key={index} className="p-4 bg-white border rounded-md shadow-sm mb-4">
                <ul className="mt-3 text-sm space-y-2 list-decimal list-inside">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: `
                                <style>
                                    .prose ol {
                                        list-style-type: decimal;
                                        padding-left: 20px;
                                        margin-top: 0;
                                        margin-bottom: 1em;
                                    }
                                    .prose ul {
                                        list-style-type: disc;
                                        padding-left: 20px;
                                        margin-top: 0;
                                        margin-bottom: 1em;
                                    }
                                    .prose li {
                                        line-height: 2.5;
                                    }
                                    .prose p {
                                        margin-top: 0;
                                        margin-bottom: 1em;
                                        line-height: 1.8;
                                    }
                                    .prose a {
                                        color: blue;
                                        text-decoration: none;
                                    }
                                    .prose a:hover {
                                        text-decoration: underline;
                                    }
                                </style>
                                ${item.content}
                                `,
                    }}
                  />
                </ul>

                <p className="text-base font-semibold text-gray-900 mt-2" style={{ textTransform: "capitalize" }}>
                  {item.answer}
                  {item.subfield_response != "" && item.answer == "yes" ? ` - ${item.subfield_response}` : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-10  mb-10 hidden sm:flex">
            <BackButton label={"Back"} onClick={() => router.push("/step4")} />
            <NextButton label={"Next"} onClick={() => dispatch(nextStep())} />
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
                <button
                  type="submit"
                  onClick={() => dispatch(nextStep())}
                  className={`p-3 flex flex-col items-center justify-center ${"text-white rounded-md bg-violet-700"}`}
                >
                  <span className="text-md font-semibold px-6">Next</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </StepperWrapper>
    </>
  );
}
export default Step6;
