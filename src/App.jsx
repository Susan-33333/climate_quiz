import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizIntro from "./components/QuizIntro";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

// 🔥 加入 Firestore 寫入函式
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// 定義流程步驟常數
export const steps = {
  USER_INPUT: "USER_INPUT",
  STORY: "STORY",
  QUIZ_INTRO: "QUIZ_INTRO",
  QUIZ_MAIN: "QUIZ_MAIN",
  RESULT: "RESULT",
  TAGS: "TAGS",
  RADAR: "RADAR",
};

// 步驟列表（可用於控制進度條）
const stepList = [
  steps.USER_INPUT,
  steps.STORY,
  steps.QUIZ_INTRO,
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
  const [step, dispatch] = useReducer(stepReducer, steps.USER_INPUT);
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
      {step === steps.USER_INPUT && (
        <UserInputForm
          onSave={async (data) => {
            // ✅ 將資料存到 local state
            setUserData(data);

            // ✅ 儲存到 Firestore
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
import "tailwindcss/tailwind.css"; // 引入 Tailwind CSS
<div className="text-3xl text-pink-500 font-bold">Tailwind 啟動成功</div>
export default App;
