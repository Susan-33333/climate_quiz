import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizIntro from "./components/QuizIntro";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

// 🔥 Firestore
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// 🪄 步驟常數（順序：STORY → USER_INPUT → QUIZ...）
export const steps = {
  STORY: "STORY",
  USER_INPUT: "USER_INPUT",
  QUIZ_INTRO: "QUIZ_INTRO",
  QUIZ_MAIN: "QUIZ_MAIN",
  RESULT: "RESULT",
  TAGS: "TAGS",
  RADAR: "RADAR",
};

const stepList = [
  steps.STORY,
  steps.USER_INPUT,
  steps.QUIZ_INTRO,
  steps.QUIZ_MAIN,
  steps.RESULT,
  steps.TAGS,
  steps.RADAR,
];

// reducer
function stepReducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return action.payload;
    default:
      return state;
  }
}

function App() {
  const [step, dispatch] = useReducer(stepReducer, steps.STORY); // ✅ 初始是 STORY
  const [userData, setUserData] = useState({});

  const currentStepIndex = stepList.indexOf(step);
  const totalSteps = stepList.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto">
      {/* 進度條 */}
      <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
        <div
          className="h-3 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 各步驟畫面 */}
      {step === steps.STORY && (
        <StorySegment
          userData={userData}
          onNext={() => dispatch({ type: "NEXT", payload: steps.USER_INPUT })}
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
          onNext={() => dispatch({ type: "NEXT", payload: steps.QUIZ_INTRO })}
        />
      )}

      {step === steps.QUIZ_INTRO && (
        <QuizIntro
          onStart={() => dispatch({ type: "NEXT", payload: steps.QUIZ_MAIN })}
        />
      )}

      {step === steps.QUIZ_MAIN && (
        <QuizSection
          onNext={(answers) => {
            const updatedData = { ...userData, answers };
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

      {step === steps.RADAR && <RadarChartResult userData={userData} />}
    </div>
  );
}

export default App;
