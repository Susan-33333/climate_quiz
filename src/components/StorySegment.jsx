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

    // 載入圖片，確認背景載入成功才顯示內容
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setBgImage(imageUrl);
      setImageLoaded(true);
    };

    // 呼叫故事 API
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
    <div
      className="min-h-screen bg-black flex justify-center items-center px-4"
      style={{
        backgroundColor: "#000",
      }}
    >
      <div
        className="w-full max-w-[390px] h-full bg-cover bg-top bg-no-repeat flex flex-col justify-end"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* 文字卡片區塊 */}
        {imageLoaded && (
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-6 m-4 text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">未來的你⋯⋯</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line mb-6">{story}</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
              onClick={onNext}
            >
              我準備好了！
            </button>
          </div>
        )}

        {!imageLoaded && (
          <div className="w-full text-center py-8 text-white text-sm">背景載入中⋯⋯</div>
        )}
      </div>
    </div>
  );
}

