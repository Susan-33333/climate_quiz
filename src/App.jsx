import { useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {step === 0 && <UserInputForm onNext={() => setStep(1)} onSave={setUserData} />}
      {step === 1 && <StorySegment userData={userData} onNext={() => setStep(2)} />}
      {step === 2 && <QuizSection userData={userData} onNext={() => setStep(3)} />}
      {step === 3 && <ResultPersonality userData={userData} onNext={() => setStep(4)} />}
      {step === 4 && <TagsSuggestion userData={userData} onNext={() => setStep(5)} />}
      {step === 5 && <RadarChartResult userData={userData} />}
    </div>
  );
}

export default App;
