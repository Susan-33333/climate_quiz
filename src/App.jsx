import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizIntro from "./components/QuizIntro";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

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
      {/* ✅ 進度條 */}
      <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
        <div
          className="h-3 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ✅ 各步驟畫面 */}
      {step === steps.USER_INPUT && (
        <UserInputForm
          onSave={(data) => {
            setUserData(data);
            fetch("/api/saveUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((res) => {
                if (!res.ok) throw new Error("API 回傳錯誤");
                return res.json();
              })
              .then((result) => {
                console.log("✅ 使用者資料已傳送成功", result);
              })
              .catch((err) => {
                console.error("❌ 傳送使用者資料失敗", err);
              });
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

export default App;
