import React, { useState, useEffect, useRef } from "react";

// ✅ 改版 RingChart 元件（修正動畫精度與白圈遮擋）
const RingChart = ({ score, size = 100 }) => {
  const innerSize = size * 0.7;
  const [animatedScore, setAnimatedScore] = useState(0);
  const requestRef = useRef();

  const getColor = (val) => {
    if (val < 40) return "#EF4444"; // 紅
    if (val < 70) return "#F59E0B"; // 橘
    return "#10B981"; // 綠
  };

  const color = getColor(score);

  useEffect(() => {
    let start;
    const duration = 800;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const eased = Math.min(progress / duration, 1);
      const current = score * eased;
      setAnimatedScore(current);
      if (progress < duration) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [score]);

  const radius = (size / 2) * 0.9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animatedScore / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute top-0 left-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={size * 0.1}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={size * 0.1}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          width: innerSize,
          height: innerSize,
          background: "white",
          borderRadius: "50%",
          zIndex: 10,
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-xl font-semibold text-gray-800">
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// ✅ 主元件
const TagsSuggestion = ({ userData, onNext }) => {
  const [activeTab, setActiveTab] = useState("居住");
  const [adviceMap, setAdviceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [regionData, setRegionData] = useState(null);

  if (!userData || !userData.county || !userData.town) {
    return (
      <div className="text-center text-red-600 font-bold p-6">
        ⚠️ 錯誤：使用者資料尚未傳入，請重新開始測驗。
      </div>
    );
  }

  const fullRegionKey = `${userData.county}_${userData.town}`;
  const fullRegionDisplay = fullRegionKey.replace(/_/g, " ");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/region_scores.json`);
        const json = await res.json();
        setRegionData(json);
      } catch (err) {
        console.error("載入 region_scores.json 錯誤：", err);
      }
    };
    fetchData();
  }, []);

  const fallback = {
    score: 50,
    description: "資料載入中或無對應資料。",
    disaster: "未知",
    recommend: "未知",
  };

  const tabContent = {
    居住: {
      ...fallback,
      score: regionData?.[fullRegionKey]?.["居住"] ?? fallback.score,
    },
    旅遊: {
      ...fallback,
      score: regionData?.[fullRegionKey]?.["旅遊"] ?? fallback.score,
    },
    交通: {
      ...fallback,
      score: regionData?.[fullRegionKey]?.["交通"] ?? fallback.score,
    },
  };

  const current = tabContent[activeTab];

  const generateAdvice = async (tab) => {
    setLoading(true);
    const payload = {
      tab,
      region: fullRegionKey,
      score: tabContent[tab].score,
      disaster: tabContent[tab].disaster,
      recommend: tabContent[tab].recommend,
    };

    try {
      const res = await fetch("https://climate-ai-proxy.climate-quiz-yuchen.workers.dev/api/generate-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const reply = data?.result || "目前無法取得建議。";
      setAdviceMap((prev) => ({ ...prev, [tab]: reply }));
    } catch (error) {
      console.error("fetch error", error);
      setAdviceMap((prev) => ({ ...prev, [tab]: "⚠️ 發生錯誤，請稍後再試。" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adviceMap[activeTab]) {
      generateAdvice(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg bg-white shadow">
      <div className="flex justify-center mb-4 space-x-4">
        {["居住", "旅遊", "交通"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-400"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-6">
        <RingChart score={current.score} />
        <div>
          <h2 className="text-xl font-bold">未來 30 年後 {fullRegionDisplay}：</h2>
          <p className="text-gray-700">{current.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">可能面臨災害：</p>
        <p className="text-gray-600">{current.disaster}</p>
      </div>

      <div>
        <p className="font-semibold">推薦養老地點：</p>
        <p className="text-gray-600">{current.recommend}</p>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <input
          type="range"
          min={0}
          max={100}
          value={current.score}
          readOnly
          className="w-full"
        />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-md font-bold mb-1">🤖 AI 建議：</h3>
        {loading ? (
          <p className="text-gray-400 animate-pulse">正在產生建議...</p>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {adviceMap[activeTab] || "尚無建議。"}
          </p>
        )}
      </div>

      <div className="text-right">
        <button
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
          onClick={onNext}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default TagsSuggestion;
