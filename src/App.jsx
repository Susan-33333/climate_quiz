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

// 計算分數的函數
function calculateScores(answers) {
  // 這裡你可以根據實際的計分邏輯調整
  // 暫時使用簡單的隨機計分作為示例
  const scoreMap = {
    A: { happiness: 10, adaptability: 20, convenience: 20, convience: 10, live: 20, joy: 18, comfortable: 22 },
    B: { happiness: 15, adaptability: 20, convenience: 20, convience: 25, live: 15, joy: 20, comfortable: 18 },
    C: { happiness: 25, adaptability: 25, convenience: 15, convience: 20, live: 25, joy: 25, comfortable: 20 },
    D: { happiness: 10, adaptability: 30, convenience: 30, convience: 15, live: 20, joy: 15, comfortable: 25 }
  };

  const scores = {
    happiness: 0,
    adaptability: 0,
    residence: 0,
    transport: 0,
    tourism: 0,
    joy: 0,
    explore: 0
  };

  answers.forEach(answer => {
    const answerScores = scoreMap[answer] || scoreMap.A;
    Object.keys(scores).forEach(key => {
      scores[key] += answerScores[key];
    });
  });

  // 將分數轉換為百分比（假設每個領域最高分為200）
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(Math.round((scores[key] / 200) * 100), 100);
  });

  return scores;
}

// 根據人格選擇吉祥物
function selectMascot(personalityType) {
  const mascot = {
    T1: { image: `${import.meta.env.BASE_URL}mascot/T1.png`, name: "滴答浣熊" },
    T2: { image: `${import.meta.env.BASE_URL}mascot/T2.png`, name: "氣候適應者" },
    T3: { image: `${import.meta.env.BASE_URL}mascot/T3.png`, name: "綠色生活家" },
    T4: { image: `${import.meta.env.BASE_URL}mascot/T4.png`, name: "永續實踐者" },
  };
  return mascot[personalityType] || mascot.T1;
}

// 生成地區總結
function generateRegionSummary(userData, scores) {
  const { county, town } = userData;
  const avgScore = Math.round((scores.happiness + scores.adaptability + scores.residence + scores.transport + scores.tourism) / 5);
  
  return `根據分析，${county}${town}在未來30年的氣候適應性評分為${avgScore}分，建議關注居住環境和交通綠能的改善。`;
}

function App() {
  const [step, dispatch] = useReducer(stepReducer, steps.QUIZ_INTRO);
  const [userData, setUserData] = useState({});

  const currentStepIndex = stepList.indexOf(step);
  const totalSteps = stepList.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
  {step === steps.QUIZ_MAIN && (
  <ProgressBarPortal
    currentStep={userData.answers?.length + 1 || 1}
    totalSteps={8}
    mascotSrc={`${import.meta.env.BASE_URL}mascot/T6.png`}
  />
)}
  return (
    <div className="min-h-screen font-huninn bg-gray-100 p-4 max-w-3xl mx-auto">

      {/* 各步驟畫面 */}
      {step === steps.QUIZ_INTRO && (
        <QuizIntro
          onStart={() => dispatch({ type: "NEXT", payload: steps.USER_INPUT })}
        />
      )}

      {step === steps.USER_INPUT && (
        <UserInputForm
          onSave={async (data) => {
            try {
              await addDoc(collection(db, "users"), data);
              setUserData(data);
              dispatch({ type: "NEXT", payload: steps.STORY });
            } catch (err) {
              alert("資料儲存失敗，請再試一次！");
              console.error("❌", err);
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
        <ProgressBarPortal
          currentStep={userData.answers?.length + 1 || 1}
          totalSteps={8}
          mascotSrc={`${import.meta.env.BASE_URL}mascot/T6.png`}
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
          onNext={() => {
            // 在進入雷達圖之前計算所有必要的數據
            const scores = calculateScores(userData.answers);
            
            // 根據答案確定人格類型
            const count = { A: 0, B: 0, C: 0, D: 0 };
            userData.answers.forEach((ans) => {
              if (count[ans]) {
                count[ans]++;
              } else {
                count[ans] = 1;
              }
            });
            
            const maxOption = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
            const personalityMap = {
              A: "T1",
              B: "T2", 
              C: "T3",
              D: "T4",
            };
            
            const personalityType = personalityMap[maxOption] || "T1";
            const mascot = selectMascot(personalityType);
            const regionSummary = generateRegionSummary(userData, scores);
            
            const finalData = {
              ...userData,
              scores,
              mascot,
              regionSummary,
              personalityType
            };
            
            setUserData(finalData);
            dispatch({ type: "NEXT", payload: steps.RADAR });
          }}
        />
      )}

      {step === steps.RADAR && userData?.scores && (
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