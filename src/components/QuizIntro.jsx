import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f4] flex justify-center px-4">
      <div className="w-full max-w-md flex flex-col justify-center items-center space-y-8 py-16">
        {/* 圖片區塊 */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
          <img
            src={bgImage}
            alt="開始測驗圖片"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold">準備好了嗎？</h2>
          </div>
        </div>

        {/* 文字與按鈕 */}
        <div className="w-full text-center bg-white/90 backdrop-blur p-6 rounded-2xl shadow">
          <p className="text-gray-700 text-lg mb-6">
            這份測驗將會探究你與氣候之間的相性
          </p>
          <button
            onClick={onStart}
            className="bg-brown-600 hover:bg-brown-700 text-white text-lg font-semibold px-6 py-3 rounded-full transition"
          >
            開始測驗
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizIntro;



