import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md md:rounded-3xl md:shadow-lg md:bg-white md:p-10 flex flex-col justify-center space-y-6 text-center">
        <div className="w-full h-64 overflow-hidden rounded-xl">
          <img
            src={bgImage}
            alt="開始測驗圖片"
            className="w-full h-full object-fill"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800">準備好了嗎？</h2>
        <p className="text-gray-600 text-lg">這份測驗將會探究你與氣候之間的相性</p>

        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-xl transition"
        >
          開始測驗
        </button>
      </div>
    </div>
  );
}

export default QuizIntro;

