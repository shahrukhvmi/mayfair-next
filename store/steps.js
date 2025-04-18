import { createSlice } from "@reduxjs/toolkit";

// Initial state for multiple steps
const initialState = {
  stepPrevApiData: null,
  step1: [],
  step2: [],
  step3: [],
  step4: [],
  step5: [],
  step6: [],
};

const stepSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    setStepPrevApiData: (state, action) => {
      state.stepPrevApiData = action.payload;
      localStorage.setItem("stepPrevApiData", JSON.stringify(action.payload));
    },
    // Step One: Add Data
    setStep1(state, action) {
      state.step1 = action.payload;
      localStorage.setItem("step1", JSON.stringify(state.step1));
    },
    // Step Two: Add Data
    setStep2(state, action) {
      state.step2 = action.payload;
      localStorage.setItem("step2", JSON.stringify(state.step2));
    },
    // Step Three: Add Data
    setStep3(state, action) {
      state.step3 = action.payload;
      localStorage.setItem("step3", JSON.stringify(state.step3));
    },
    setStep4(state, action) {
      state.step4 = action.payload;
      localStorage.setItem("step4", JSON.stringify(state.step4));
    },
    setStep5(state, action) {
      state.step5 = action.payload;
      localStorage.setItem("step5", JSON.stringify(state.step5));
    },
    setStep6(state, action) {
      state.step6 = action.payload;
      localStorage.setItem("step6", JSON.stringify(state.step6));
    },
  },
});

// Export actions
export const { setStep1, setStep2, setStep3, setStep4, setStepPrevApiData, setStep5, setStep6 } =
  stepSlice.actions;

// Export reducer
export default stepSlice.reducer;
