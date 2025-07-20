import { useEffect, useState } from "react";

export default function StorySegment({ userData, onNext }) {
  const [story, setStory] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [storyLoaded, setStoryLoaded] = useState(false);

  useEffect(() => {
    const age = parseInt(userData.age, 10);
    if (isNaN(age)) return;
    const projectedAge = age + 30;

    const getAgeCategory = (age) => {
      if (age <= 40) return "youth";
      else if (age <= 65) return "adult";
      else return "elder";
    };

    const category = getAgeCategory(projectedAge);
    const base = import.meta.env.BASE_URL || "/";
    const imageUrl = `${base}mascot/${category}.jpg`;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setBgImage(imageUrl);
      setImageLoaded(true);
    };

    fetch("https://climate-ai-proxy.climate-quiz-yuchen.workers.dev/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: projectedAge }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API 回應非 200");
        return res.json();
      })
      .then((data) => {
        setStory(data.result);
        setStoryLoaded(true);
      })
      .catch((err) => {
        console.error("生成故事錯誤：", err);
        setStory("⚠️ 故事載入失敗，請稍後再試。");
        setStoryLoaded(true);
      });
  }, [userData]);

  const allLoaded = imageLoaded && storyLoaded;

  return (
    <div className="min-h-screen w-full bg-[#E0E0E0] flex justify-center relative overflow-hidden">
      {/* 背景圖層 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] h-screen z-0">
        <img
          src={bgImage}
          alt="背景圖片"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 載入中：Spinner + 遮罩 */}
      {!allLoaded && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-white text-base font-semibold">正在載入你的未來世界⋯⋯</p>
          </div>
        </div>
      )}

      {/* 正式內容 */}
      {allLoaded && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="w-full max-w-[414px] px-8 flex justify-center items-center">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-6 text-center shadow-lg w-full max-w-[300px]">
              <h2 className="text-2xl font-bold mb-6">未來的你⋯⋯</h2>
              <p className="text-base leading-loose whitespace-pre-line mb-8">{story}</p>
              {story && (
                <button
                  className="w-full py-3 px-6 rounded-full rounded-[36px] text-white font-bold text-base transition h-[40px] bg-[#3b82f6] hover:bg-[#2563eb]"
                  onClick={onNext}
                >
                  我準備好了！
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
