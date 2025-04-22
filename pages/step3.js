import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { nextStep, prevStep } from "../../store/slice/stepper";
// import { usePostStepsMutation } from "../../store/services/Steps/Steps";
import toast from "react-hot-toast";
import { setStep3, setStep4 } from "@/store/steps";
import { useForm, Controller } from "react-hook-form";
import NextButton from "@/Components/NextButton/NextButton";
import BackButton from "@/Components/BackButton/BackButton";
import { FaCheck } from "react-icons/fa";
import StepperWrapper from "@/layout/StepperWrapper";
import { useRouter } from "next/router";
import { useGetQuestionsQuery } from "@/store/questionsApi";
  const Step3 = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const step3Data = useSelector((state) => state.steps.step3);

  console.log(step3Data, "step 3 data from start");

  // console.log(step3Data, "step3 dattaaaaaaaaaa");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change to "auto" for instant scrolling
    });
  }, []);

  // States
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [errorMessages, setErrorMessages] = useState({}); // Error messages for validation

  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // Load data from localStorage
  const stepPrevApiData = useMemo(() => localStorage.getItem("stepPrevApiData"), []);
  const stepPrev3 = useMemo(() => localStorage.getItem("step3"), []);
  const parsedData = stepPrevApiData ? JSON.parse(stepPrevApiData) : null;
  // const stepPrev3Data = stepPrev3 ? JSON.parse(stepPrev3) : null;
  const stepPrev3Data = stepPrev3 !== undefined && stepPrev3 != "undefined" && stepPrev3 ? JSON.parse(stepPrev3) : undefined;

  useEffect(() => {
    if (step3Data) {
      const medicalQuestions = step3Data || [];
      console.log(medicalQuestions, "medicalQuestions");
      // const lastConsultationData = parsedData?.last_consultation_data?.medicalInfo || [];

      // Merge Data
      const mergedQuestions = medicalQuestions.map((q, index) => {
        // const prevAnswer = step3Data?.find((p) => p.question === q.content);
        // const matchedConsultation = lastConsultationData.find((lq) => lq.question === q.content);
        console.log(step3Data, "step3Dataaaaaaaaaa");
        // console.log(p.question, "p.question");
        // console.log(q.content, "q.content");
        // console.log(prevAnswer, "prevAnswer");

        return {
          ...q,
          id: index,
          answer: q?.answer || "",
          subfield_response: q?.subfield_response || "",
        };
      });

      setQuestions(mergedQuestions);
      // console.log(mergedQuestions, "mergedQuestions");

      // Pre-fill Form Values
      const initialResponses = {};
      mergedQuestions.forEach((q) => {
        initialResponses[q.id] = {
          answer: q.answer,
          subfield_response: q.subfield_response,
          sub_field_prompt: q.sub_field_prompt,
          has_sub_field: q.has_sub_field,
        };
        setValue(`responses[${q.id}].answer`, q.answer);
        setValue(`responses[${q.id}].subfield_response`, q.subfield_response);
      });
      setResponses(initialResponses);
    }
  }, [stepPrevApiData, stepPrev3, setValue]);

  // Handle Changes
  const handleChange = async (id, value, isSubField = false) => {
    setResponses((prev) => {
      const updated = isSubField ? { ...prev[id], subfield_response: value } : { ...prev[id], answer: value };

      // Clear subfield if "No"
      if (!isSubField && value === "no") updated.subfield_response = "";

      // Check Validation Error Message
      const question = questions.find((q) => q.id === id);
      const isAnswerValid = question?.validated_answers.includes(value);

      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [id]: !isAnswerValid ? question?.validation_error_msg || "" : "",
      }));

      setValue(`responses[${id}]`, updated);
      trigger();

      return { ...prev, [id]: updated };
    });
  };

  // Submit API Call
  // const [postSteps, { isLoading }] = usePostStepsMutation();
  // const getPid = localStorage.getItem("pid");
  // const stockPid = localStorage.getItem("p_id");

  // const reorder_concent = localStorage.getItem("reorder_concent") || null;
  const onSubmit = async () => {
    console.log("medicalInfo");
    const medicalInfo = questions.map((q) => ({
      answer: responses[q.id]?.answer || "",
      checklist: q.checklist,
      content: q.content,
      ftype: q.ftype,
      has_check_filed: q.has_check_filed,
      has_sub_field: responses[q.id]?.has_sub_field || false,
      id: q.id,
      options: q.options,
      qtype: q.qtype,
      sub_field_prompt: responses[q.id]?.sub_field_prompt || "",
      subfield_response: responses[q.id]?.subfield_response || "",
      summary: q.content,
      validated_answers: q.validated_answers,
      validation_error_msg: q.validation_error_msg,
    }));

    // console.log(step3Data, "questions");
    console.log(step3Data, "questions");

    dispatch(setStep3(medicalInfo));
    router.push("/step4");
    // try {
    //   const response = await postSteps({
    //     medicalInfo,
    //     pid: getPid || stockPid,
    //     reorder_concent: reorder_concent ? reorder_concent.toString() : null,
    //   }).unwrap();
    //   if (response?.status === true) {
    //     dispatch(setStep3(response?.lastConsultation?.fields?.medicalInfo));
    //     dispatch(nextStep());
    //   } else {
    //     toast.error("Failed to submit data.");
    //   }
    // } catch (err) {
    //   toast.error("An error occurred while submitting.");
    // }
  };

  // Check if Next Button Should be Enabled
  const isNextEnabled = questions.every((q) => {
    const answer = watch(`responses[${q.id}].answer`);
    const subfield = watch(`responses[${q.id}].subfield_response`);

    return (
      !errorMessages[q.id] && // No validation error message
      (answer === "no" || // "No" doesn't need subfield validation
        (answer === "yes" && (!q.has_sub_field || (subfield && subfield.trim() !== "")))) // Validate text area
    );
  });

  return (
    <StepperWrapper>
      <div className="pb-20 sm:pb-0 px-12 my-8">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-light">
            Step 3: <span className="font-bold">Medical Questions</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          {questions.map((q) => {
            const selectedAnswer = watch(`responses[${q.id}].answer`);
            // {
            //   console.log(q, "Questions");
            // }
            return (
              <div
                key={q.id}
                className={`mb-8 flex justify-between field | border rounded-md p-3 flex-col lg:flex-row items-start gap-5 lg:gap-10 ${
                  errorMessages[q.id] ? "border-red-300" : "border-gray-300"
                }`}
              >
                <div className="font-reg md:text-sm text-[#1C1C29]">
                  {/ul|li/.test(q.content) ? (
                    <div
                      className="font-reg md:text-sm text-[#1C1C29] leading-relaxed pe-2"
                      dangerouslySetInnerHTML={{
                        __html: q.content.replace(/<ul>/g, '<ul class="list-disc ml-5 space-y-2">'),
                      }}
                    ></div>
                  ) : (
                    // Render plain text for non-list content
                    <div className="font-reg md:text-sm text-[#1C1C29]pe-2">{q.content}</div>
                  )}
                  {q.has_sub_field && selectedAnswer === "yes" && (
                    <textarea
                      className="w-full p-2 border-2 border-violet-700 rounded-lg mt-4"
                      placeholder={q.sub_field_prompt}
                      value={responses[q.id]?.subfield_response}
                      onChange={(e) => handleChange(q.id, e.target.value, true)}
                    />
                  )}

                  {errorMessages[q.id] && <p className="text-red-500 text-sm mb-2">{errorMessages[q.id]}</p>}
                </div>

                <div className="flex gap-4">
                  {q.options.map((option) => (
                    <div>
                      <label
                        key={option}
                        className={`flex w-24 p-3 rounded-md shadow-md cursor-pointer border-2 items-center justify-between ${
                          selectedAnswer === option ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
                        }`}
                      >
                        <Controller
                          name={`responses[${q.id}].answer`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="radio"
                              {...field}
                              value={option}
                              checked={field.value === option}
                              onChange={(e) => handleChange(q.id, e.target.value)}
                              className="hidden"
                            />
                          )}
                        />
                        <span className={`text-sm font-semibold capitalize ${selectedAnswer === option ? "text-[#4DB581]" : "text-gray-500 "}`}>
                          {option}
                        </span>
                        {selectedAnswer === option && <FaCheck color="#4DB581" className="ml-2" size={14} />}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="mt-10 mb-10 hidden sm:flex">
            <BackButton label={"Back"} onClick={() => router.push("/step2")} />
            {/* <NextButton disabled={!isNextEnabled || isLoading} label={"Next"} loading={isLoading} /> */}
            <NextButton disabled={!isNextEnabled} label={"Next"} />
          </div>

          <div className="fixed bottom-2 w-[95%] mx-auto left-0 right-0 z-50 block sm:hidden">
            <div className="relative flex justify-between items-center bg-white/30 backdrop-blur-lg rounded-lg py-3 px-6 shadow-lg border border-white/40">
              {/* Content Layer (to prevent blur on buttons) */}
              <div className="relative flex w-full justify-between items-center">
                {/* Back Button */}
                <button
                  onClick={() => router.push("/step2")}
                  className="flex flex-col items-center justify-center text-white rounded-md bg-violet-700 p-3"
                >
                  <span className="text-md font-semibold px-6">Back</span>
                </button>

                {/* Proceed Button */}
                {/* <button
                type="submit"
                disabled={!isNextEnabled || isLoading}
                className={`p-3 flex flex-col items-center justify-center ${
                  !isNextEnabled || isLoading
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
                  disabled={!isNextEnabled}
                  className={`p-3 flex flex-col items-center justify-center ${
                    !isNextEnabled
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
export default Step3;
