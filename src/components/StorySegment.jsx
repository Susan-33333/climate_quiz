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

    // 載入圖片
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setBgImage(imageUrl);
      setImageLoaded(true);
    };

    // 抓故事
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
      className="min-h-screen w-full bg-black flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain", // ✅ 這樣可以完整呈現圖片
      }}
    >
      {/* 背景圖載入完成後才顯示文字與按鈕 */}
      {imageLoaded && (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-6 text-center">
          <h2 className="text-3xl font-bold mb-4">未來的你⋯⋯</h2>
          <p className="mb-6 whitespace-pre-line text-base leading-relaxed">{story}</p>

          <button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-6 py-3 rounded-xl transition"
          >
            我準備好了！
          </button>
        </div>
      )}
      {!imageLoaded && (
        <p className="text-white text-sm absolute bottom-10">背景載入中⋯⋯</p>
      )}
    </div>
  );
}
