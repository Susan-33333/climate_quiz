import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 中央文字卡片 */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">準備好了嗎？</h2>
        <p className="text-gray-700 text-lg">
          這份測驗將會探究你與氣候之間的相性
        </p>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
        >
          開始測驗
        </button>
      </div>
    </div>
  );
}

export default QuizIntro;






