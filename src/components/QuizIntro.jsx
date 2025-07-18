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
        <h2 className="text-3xl sm:text-4xl font-bold font-huninn text-gray-800 leading-snug">
          準備好了嗎？
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 font-huninn leading-relaxed">
          這份測驗將會探究你與氣候之間的相性
        </p>
        <button
          onClick={onStart}
          className="block w-full rounded-[36px] sm:rounded-[36px] border-3 sm:border-4 px-4 sm:px-6 py-4 sm:py-5 text-center font-bold text-lg sm:text-xl leading-loose transition-all duration-300 bg-white text-[#70472d] border-[#70472d] hover:shadow-[0_0_0_3px_rgba(112,71,45,0.4)] active:shadow-[0_0_0_3px_rgba(112,71,45,0.6)]"
        >
          開始測驗
        </button>
      </div>
    </div>
  );
}

export default QuizIntro;







