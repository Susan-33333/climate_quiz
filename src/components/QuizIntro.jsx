import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`);
  }, []);

  return (
    <div
      className="relative w-full h-[600px] flex items-center justify-center text-white text-center px-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/50 p-6 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">準備好了嗎？</h2>
        <p className="mb-6">這份測驗將會探究你與氣候之間的相性</p>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
        >
          開始測驗
        </button>
      </div>
    </div>
  );
}

export default QuizIntro;
