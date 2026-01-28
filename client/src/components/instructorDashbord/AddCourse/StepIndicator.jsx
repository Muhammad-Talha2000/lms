import React from "react";

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= index + 1
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-1 ${
                  currentStep > index + 1 ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
