// components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 10, mascotSrc = null }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="relative h-6 w-full">
      {mascotSrc && (
        <div
          className="absolute z-20 -top-4 transition-all duration-700 ease-out"
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          <img
            src={mascotSrc}
            alt="松鼠"
            className="w-6 h-6 object-contain drop-shadow"
          />
        </div>
      )}
      <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#70472d] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
