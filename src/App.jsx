import { useReducer, useState } from "react";
import UserInputForm from "./components/UserInputForm";
import StorySegment from "./components/StorySegment";
import QuizSection from "./components/QuizSection";
import ResultPersonality from "./components/ResultPersonality";
import TagsSuggestion from "./components/TagsSuggestion";
import RadarChartResult from "./components/RadarChartResult";

// 1️⃣ 定義步驟常數
export const steps = {
  USER_INPUT: 'USER_INPUT',
  STORY: 'STORY',
  QUIZ: 'QUIZ',
  RESULT: 'RESULT',
  TAGS: 'TAGS',
  RADAR: 'RADAR',
};

// 2️⃣ 定義 reducer
function stepReducer(state, action) {
  switch (action.type) {
    case 'NEXT':
      return action.payload;
    default:
      return state;
  }
}

function App() {
  // 3️⃣ 使用 useReducer 控制流程
  const [step, dispatch] = useReducer(stepReducer, steps.USER_INPUT);

  // 4️⃣ 使用 useState 管理使用者資料
  const [userData, setUserData] = useState({});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {step === steps.USER_INPUT && (
        <UserInputForm
          onNext={() => dispatch({ type: 'NEXT', payload: steps.STORY })}
          onSave={setUserData}
        />
      )}
      {step === steps.STORY && (
        <StorySegment
          userData={userData}
          onNext={() => dispatch({ type: 'NEXT', payload: steps.QUIZ })}
        />
      )}
      {step === steps.QUIZ && (
        <QuizSection
          userData={userData}
          onNext={() => dispatch({ type: 'NEXT', payload: steps.RESULT })}
        />
      )}
      {step === steps.RESULT && (
        <ResultPersonality
          userData={userData}
          onNext={() => dispatch({ type: 'NEXT', payload: steps.TAGS })}
        />
      )}
      {step === steps.TAGS && (
        <TagsSuggestion
          userData={userData}
          onNext={() => dispatch({ type: 'NEXT', payload: steps.RADAR })}
        />
      )}
      {step === steps.RADAR && (
        <RadarChartResult userData={userData} />
      )}
    </div>
  );
}

export default App;
