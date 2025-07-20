import React, { useState, useEffect, useRef } from "react";

const RingChart = ({ score, size = 100 }) => {
  const innerSize = size * 0.7;
  const [animatedScore, setAnimatedScore] = useState(0);
  const requestRef = useRef();

  const getColor = (val) => {
    if (val < 40) return "#EF4444";
    if (val < 70) return "#F59E0B";
    return "#10B981";
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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
        className="absolute"
        style={{
          width: innerSize,
          height: innerSize,
          background: "white",
          borderRadius: "50%",
        }}
      ></div>

      <div className="absolute text-center">
        <span className="text-xl font-semibold text-gray-800">
          {Math.round(animatedScore)}
        </span>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#fefcf9] flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-center w-full max-w-4xl p-8 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="w-full flex items-stretch justify-between gap-2 bg-[#f9f3ef] p-2 rounded-xl">
            {[
              { label: "居住", icon: "🏠" },
              { label: "旅遊", icon: "🏝️" },
              { label: "交通", icon: "🚌" }
            ].map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex-1 flex flex-col justify-center items-center text-sm font-bold py-3 rounded-lg transition-all duration-200 ${
                  activeTab === label
                    ? "bg-[#70472d] text-white shadow-md"
                    : "text-[#70472d] hover:bg-[#e9d9cc]"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="mt-1">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4 pt-4 text-left">
  <h2 className="text-xl font-bold text-gray-800">未來 30 年後 {fullRegionDisplay}</h2>
  <RingChart key={activeTab} score={current.score} />
  <p className="text-sm text-gray-700">{current.description}</p>
  <div className="text-sm text-gray-800">
    <p className="font-semibold">可能面臨災害：</p>
    <p className="text-gray-600">{current.disaster}</p>
    <p className="font-semibold mt-2">推薦養老地點：</p>
    <p className="text-gray-600">{current.recommend}</p>
  </div>
</div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
          <h3 className="text-sm font-bold mb-1">🤖 AI 建議：</h3>
          {loading ? (
            <p className="text-gray-400 animate-pulse">正在產生建議...</p>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {adviceMap[activeTab] || "尚無建議。"}
            </p>
          )}
        </div>

        <div className="pt-4 text-right">
          <button
            className="bg-[#70472d] hover:bg-[#5d3923] text-[#ffffffff] px-6 py-2 rounded-full text-sm font-bold transition-all duration-300"
            onClick={onNext}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsSuggestion;