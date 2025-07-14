import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizIntro from "./components/QuizIntro";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const steps = {
  QUIZ_INTRO: "QUIZ_INTRO",
  USER_INPUT: "USER_INPUT",
  STORY: "STORY",
  QUIZ_MAIN: "QUIZ_MAIN",
  RESULT: "RESULT",
  TAGS: "TAGS",
  RADAR: "RADAR",
};

const stepList = [
  steps.QUIZ_INTRO,
  steps.USER_INPUT,
  steps.STORY,
  steps.QUIZ_MAIN,
  steps.RESULT,
  steps.TAGS,
  steps.RADAR,
];

// 控制流程的 reducer
function stepReducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return action.payload;
    default:
      return state;
  }
}

function App() {
  const [step, dispatch] = useReducer(stepReducer, steps.QUIZ_INTRO); // 初始為 Intro
  const [userData, setUserData] = useState({});

  const currentStepIndex = stepList.indexOf(step);
  const totalSteps = stepList.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto">
      {/* 進度條 */}
      <div className="relative w-full h-3 bg-gray-300 rounded-full mb-6">
        <div
          className="h-3 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute -top-3 transition-all duration-500"
          style={{ left: `calc(${progressPercent}% - 12px)` }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/icon.png`}
            alt="進度角色"
            className="w-6 h-6"
          />
        </div>
      </div>


      {/* 各步驟畫面 */}
      {step === steps.QUIZ_INTRO && (
        <QuizIntro
          onStart={() => dispatch({ type: "NEXT", payload: steps.USER_INPUT })}
        />
      )}

      {step === steps.USER_INPUT && (
        <UserInputForm
          onSave={async (data) => {
            setUserData(data);
            try {
              const docRef = await addDoc(collection(db, "users"), data);
              console.log("✅ Firestore 儲存成功，ID:", docRef.id);
            } catch (err) {
              console.error("❌ 儲存失敗：", err);
              alert("儲存使用者資料失敗，請稍後再試");
            }
          }}
          onNext={() => dispatch({ type: "NEXT", payload: steps.STORY })}
        />
      )}

      {step === steps.STORY && (
        <StorySegment
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.QUIZ_MAIN })}
        />
      )}

      {step === steps.QUIZ_MAIN && (
        <QuizSection
          onNext={(answers) => {
          const scores = calculateScores(answers);
          const mascot = getMascot(answers);
          const updatedData = {
            ...userData,
            answers,
            scores,
            mascot,
            regionSummary: getRegionSummary(userData.county, userData.township),
          };
          setUserData(updatedData);
          dispatch({ type: "NEXT", payload: steps.RESULT });
        }}
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
  <RadarChartResult
    scores={userData.scores}
    mascot={userData.mascot}
    regionSummary={userData.regionSummary}
  />
    )}

    </div>
  );
}

export default App;
