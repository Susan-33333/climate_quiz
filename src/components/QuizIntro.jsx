import { useEffect, useState } from "react";

function QuizIntro({ onStart }) {
  const [bgImage, setBgImage] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const imagePath = `${import.meta.env.BASE_URL}assets/quiz-start.png`;
    setBgImage(imagePath);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 用隱藏 <img> 觸發圖片 onLoad */}
      <img
        src={bgImage}
        alt="背景圖"
        onLoad={() => setIsImageLoaded(true)}
        className="hidden"
      />

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center max-w-md w-full space-y-6">
        <h2 className="text-4xl sm:text-5xl font-bold font-huninn text-gray-800 leading-snug">
          氣候變遷占卜師——未Life
        </h2>
        <p className="text-xs text-gray-700 font-huninn leading-relaxed">
          帶你進入30年後氣候變遷的世界
        </p>

        {/* 只有當圖片載入完才顯示按鈕 */}
        {isImageLoaded && (
          <button
            onClick={onStart}
            className="h-[40px] inline-block font-bold text-[16px] rounded-[36px] border-2 px-4 py-2 text-center text-[#E0E0E0] border-[#E0E0E0] hover:shadow-[0_0_0_2px_rgba(112,71,45,0.4)] active:shadow-[0_0_0_2px_rgba(112,71,45,0.6)] transition-all duration-300"
          >
            開始穿越
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizIntro;










