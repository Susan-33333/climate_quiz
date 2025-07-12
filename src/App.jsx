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
          onSave={(data) => {
            setUserData(data); // 1. 存到本地 state

            // 2. 傳送到後端 API（你可改成你自己的 URL）
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
          onNext={() => dispatch({ type: "NEXT", payload: steps.QUIZ })}
        />
      )}

      {step === steps.QUIZ && (
        <QuizSection
          userData={userData}
          onNext={(answers) => {
            const updatedData = { ...userData, answers }; // ✅ 把 answers 放進 userData
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
        <RadarChartResult userData={userData} />
      )}
    </div>
  );
}

export default App;
