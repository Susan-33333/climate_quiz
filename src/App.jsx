console.log("🌱 這是進度條版本 v2");

import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

// 定義流程步驟常數
export const steps = {
  USER_INPUT: "USER_INPUT",
  STORY: "STORY",
  QUIZ: "QUIZ",
  RESULT: "RESULT",
  TAGS: "TAGS",
  RADAR: "RADAR",
};

// 步驟列表（用來顯示進度）
const stepList = [
  steps.USER_INPUT,
  steps.STORY,
  steps.QUIZ,
  steps.RESULT,
  steps.TAGS,
  steps.RADAR,
];

// 控制流程的 reducerS
function stepReducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return action.payload;
    default:
      return state;
  }
}

function App() {
  const [step, dispatch] = useReducer(stepReducer, steps.USER_INPUT);
  const [userData, setUserData] = useState({});

  const currentStepIndex = stepList.indexOf(step);
  const totalSteps = stepList.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto">
      {/* 進度文字 */}
      <p className="text-center text-sm text-gray-600 mb-2">
        第 {currentStepIndex + 1} 步 / 共 {totalSteps} 步
      </p>

      {/* 進度條 */}
      <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
        <div
          className="h-3 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 各步驟畫面 */}
      {step === steps.USER_INPUT && (
        <UserInputForm
          onSave={setUserData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.STORY })}
        />
      )}

      {step === steps.STORY && (
        <StorySegment
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.QUIZ })}
        />
      )}

      {step === steps.QUIZ && (
        <QuizSection
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.RESULT })}
        />
      )}

      {step === steps.RESULT && (
        <ResultPersonality
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.TAGS })}
        />
      )}

      {step === steps.TAGS && (
        <TagsSuggestion
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.RADAR })}
        />
      )}

      {step === steps.RADAR && (
        <RadarChartResult userData={userData} />
      )}
    </div>
  );
}

export default App;
