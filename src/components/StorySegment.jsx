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

    // 載入背景圖
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setBgImage(imageUrl);
      setImageLoaded(true);
    };

    // ✅ 呼叫正確的 generate-story API 路徑
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
      className="relative bg-cover bg-center text-white p-10 rounded-xl shadow-lg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-sm bg-black/40 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">未來的你⋯⋯</h2>
        <p className="mb-6 whitespace-pre-line">{story}</p>

        {imageLoaded ? (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            onClick={onNext}
          >
            我準備好了！
          </button>
        ) : (
          <p className="text-white text-sm">背景載入中⋯⋯</p>
        )}
      </div>
    </div>
  );
}
