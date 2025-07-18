function ProgressBar({ currentStep, totalSteps, mascotSrc }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative w-full h-4 bg-[#f9f4ef] rounded-full overflow-hidden">
      <img
        src={mascotSrc}
        alt="progress mascot"
        className="absolute -top-6 w-10 h-10 transition-all duration-500"
        style={{ left: `calc(${progress}% - 1.25rem)` }}
      />
      <div
        className="h-full bg-[#004B97] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
