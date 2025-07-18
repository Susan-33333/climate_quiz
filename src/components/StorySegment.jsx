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
    <div className="min-h-screen w-full bg-[#E0E0E0] flex justify-center items-center">
      <div className="relative w-full max-w-[414px] flex flex-col items-center">
        {/* 背景圖片 */}
        <div className="absolute inset-0 flex justify-center">
          <img
            src={bgImage}
            alt="背景圖片"
            className="h-screen object-contain"
          />
        </div>

        {/* 內容層：圖片載入後才出現 */}
        {imageLoaded ? (
          <div className="relative z-10 w-full px-4 py-12 flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-6 text-center shadow-lg w-full max-w-xs">
              <h2 className="text-xl font-bold mb-4">未來的你⋯⋯</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line mb-6">{story}</p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
                onClick={onNext}
              >
                我準備好了！
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white text-sm z-10 mt-8">背景載入中⋯⋯</p>
        )}
      </div>
    </div>
  );
}


