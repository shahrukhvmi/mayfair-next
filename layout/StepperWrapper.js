import React from "react";
import Navbar from "./Dashboard/navbar";

export default function StepperWrapper({ children }) {
  return (<>
    <Navbar />
    <div className={`bg-gradient-to-r from-[#e0f5fc] via-[#F3F6F2] to-[#FFF7ED] `}>
      <div className="consultation-form w-full max-w-[1366px] mx-auto flex flex-col lg:flex-row font-inter overflow-hidden min-h-screen justify-center items-center px-4 py-20">
        <div
          className={`right relative bg-white mx-3 md:mx-6 lg:mx-0 w-auto rounded-xl lg:w-[55%] lg:rounded-tr-xl rounded-bl-xl lg:rounded-bl-none rounded-br-xl`}
        >
          {children}
        </div>
      </div>
    </div>
  </>
  );
}
