import { createPortal } from "react-dom";
import ProgressBar from "./ProgressBar";
import { useEffect, useState } from "react";

export default function ProgressBarPortal({ currentStep, totalSteps, mascotSrc }) {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    setPortalRoot(document.getElementById("portal-progressbar"));
  }, []);

  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full z-[9999] bg-white/70 backdrop-blur-md px-6 py-4 shadow-md">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        mascotSrc={mascotSrc}
      />
    </div>,
    portalRoot
  );
}
