// components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 10 }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percentage}%`,
          backgroundColor: '#70472d',
        }}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      />
    </div>
  );
};

export default ProgressBar;
