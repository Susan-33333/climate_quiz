import React, { useState, useEffect, useRef } from "react";

// ✅ 修正後環形圖元件
const RingChart = ({ percent, size = 140, color = "#EA0000", tooltip = "" }) => {
  const innerSize = size * 0.65;
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
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
      title={tooltip}
    >
      {/* 外圈圓環 */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${animatedPercent}%, #e5e7eb ${animatedPercent}%)`,
        }}
      ></div>

      {/* 內圈白色遮罩 */}
      <div
        className="absolute bg-white rounded-full shadow-inner"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      ></div>

      {/* 百分比文字 */}
      <div className="absolute z-10">
        <span className="text-3xl font-bold" style={{ color }}>
          {animatedPercent}%
        </span>
      </div>
    </div>
  );
};

// ✅ 主元件
const TagsSuggestion = ({ userData, onNext }) => {
  const [activeTab, setActiveTab] = useState("居住");
  const region = userData?.county || "未填地區";

  const tabContent = {
    居住: {
      score: 75,
      color: "#EA0000",
      description: "溫度年平均上升 2.3°C，降雨集中度提升。",
      disaster: "極端高溫、淹水",
      recommend: "南投鹿谷",
    },
    遊憩: {
      score: 85,
      color: "#10b981",
      description: "乾季延長適合山林活動，濕季應避免露營。",
      disaster: "乾旱、落石",
      recommend: "花蓮玉里",
    },
    交通: {
      score: 60,
      color: "#6366f1",
      description: "豪雨增加影響道路通行，需加強基礎建設。",
      disaster: "強降雨、土石流",
      recommend: "台中霧峰",
    },
  };

  const current = tabContent[activeTab];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg bg-white shadow">
      {/* 分頁選單 */}
      <div className="flex justify-center mb-4 space-x-4">
        {["居住", "遊憩", "交通"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 主內容 */}
      <div className="flex flex-col space-y-4">
        {/* 環形圖 + 說明 */}
        <div className="flex items-center justify-center space-x-6">
          <RingChart
            percent={current.score}
            color={current.color}
            tooltip={`氣候評分：${current.score}%`}
          />
          <div>
            <h2 className="text-xl font-bold">未來 30 年後 {region}：</h2>
            <p className="text-gray-700">{current.description}</p>
          </div>
        </div>

        {/* 災害敘述 */}
        <div>
          <p className="font-semibold">可能面臨災害：</p>
          <p className="text-gray-600">{current.disaster}</p>
        </div>

        {/* 推薦地點 */}
        <div>
          <p className="font-semibold">推薦養老地點：</p>
          <p className="text-gray-600">{current.recommend}</p>
        </div>

        {/* 滑桿區 */}
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={100}
            value={current.score}
            readOnly
            className="w-full"
          />
        </div>

        {/* 下一步按鈕 */}
        <div className="text-right">
          <button
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
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
