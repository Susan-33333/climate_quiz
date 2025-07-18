import { useEffect, useState } from "react";

export default function StorySegment({ userData, onNext }) {
  const [story, setStory] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

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
      })
      .catch((err) => {
        console.error("生成故事錯誤：", err);
        setStory("⚠️ 故事載入失敗，請稍後再試。");
      });
  }, [userData]);

  return (
    <div className="min-h-screen w-full bg-[#E0E0E0] flex justify-center relative overflow-hidden">
      {/* 圖片層：固定貼齊畫面上下，比例維持直式 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] h-screen z-0">
        <img
          src={bgImage}
          alt="背景圖片"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 內容層：置中對齊，且不影響圖片位置 */}
      {imageLoaded ? (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="w-full max-w-[414px] px-8 flex justify-center items-center">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-6 text-center shadow-lg w-full max-w-[300px]">
              <h2 className="text-2xl font-bold mb-6">未來的你⋯⋯</h2>
              <p className="text-base leading-loose whitespace-pre-line mb-8">{story}</p>
              {story && (
                <button
                  className="rounded-[36px] bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
                  onClick={onNext}
                >
                  我準備好了！
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="w-full max-w-[414px] px-8 flex justify-center items-center">
            <p className="text-white text-sm text-center">背景載入中⋯⋯</p>
          </div>
        </div>
      )}
    </div>
  );
}