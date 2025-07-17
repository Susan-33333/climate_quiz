import React, { useState, useEffect, useRef } from "react";

// ✅ 環形圖元件
const RingChart = ({ percent, size = 100, color = "#EA0000", tooltip = "" }) => {
  const innerSize = size * 0.75;
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const requestRef = useRef();

  useEffect(() => {
    let start;
    const duration = 800;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const current = Math.min((percent * progress) / duration, percent);
      setAnimatedPercent(Math.round(current));
      if (progress < duration) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [percent]);

  return (
    <div className="relative" style={{ width: size, height: size }} title={tooltip}>
      <div
        className="absolute rounded-full z-0"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${animatedPercent}%, #e5e7eb ${animatedPercent}%)`,
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white rounded-full" style={{ width: innerSize, height: innerSize }}></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-lg font-bold" style={{ color }}>{animatedPercent}%</span>
      </div>
    </div>
  );
};

// ✅ 主頁元件含 AI 建議功能
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/region_scores.json");
        const json = await res.json();
        setRegionData(json);
      } catch (err) {
        console.error("載入 region_scores.json 錯誤：", err);
      }
    };
    fetchData();
  }, []);

  const colorMap = {
    居住: "#EA0000",
    旅遊: "#10b981",
    交通: "#6366f1",
  };

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
      color: colorMap["居住"],
    },
    旅遊: {
      ...fallback,
      score: regionData?.[fullRegionKey]?.["旅遊"] ?? fallback.score,
      color: colorMap["旅遊"],
    },
    交通: {
      ...fallback,
      score: regionData?.[fullRegionKey]?.["交通"] ?? fallback.score,
      color: colorMap["交通"],
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
      const res = await fetch("https://climate-ai-proxy.climate-quiz-yuchen.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      {/* 分頁切換 */}
      <div className="flex justify-center mb-4 space-x-4">
        {["居住", "旅遊", "交通"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${activeTab === tab
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 圖表與說明 */}
      <div className="flex items-center justify-center space-x-6">
        <RingChart
          percent={current.score}
          color={current.color}
          tooltip={`氣候評分：${current.score}%`}
        />
        <div>
          <h2 className="text-xl font-bold">未來 30 年後 {fullRegionKey}：</h2>
          <p className="text-gray-700">{current.description}</p>
        </div>
      </div>

      {/* 災害描述 */}
      <div className="mt-4">
        <p className="font-semibold">可能面臨災害：</p>
        <p className="text-gray-600">{current.disaster}</p>
      </div>

      {/* 推薦地點 */}
      <div>
        <p className="font-semibold">推薦養老地點：</p>
        <p className="text-gray-600">{current.recommend}</p>
      </div>

      {/* 滑桿 */}
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

      {/* AI 建議區塊 */}
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

      {/* 下一步 */}
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
