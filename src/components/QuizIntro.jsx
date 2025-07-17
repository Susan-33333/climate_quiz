import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f4] flex justify-center px-4">
      <div className="w-full max-w-md flex flex-col justify-center items-center space-y-6 py-16">
        {/* 圖片區 */}
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

        {/* 說明與按鈕 */}
        <div className="w-full bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow text-center">
          <p className="text-gray-700 text-lg mb-4">
            這份測驗將會探究你與氣候之間的相性
          </p>
          <p style={{ fontFamily: 'jf-openhuninn' }}>
            這段應該要是手寫體，如果不是代表字型真的沒作用
          </p>

          <button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg transition font-semibold"
          >
            開始測驗
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizIntro;





