import React, { useState } from "react";

const TagsSuggestion = ({ userData, onNext }) => {
  const [activeTab, setActiveTab] = useState("居住");

  const region = userData?.county || "未填地區";

  const tabContent = {
    居住: {
      score: 75,
      description: "溫度年平均上升 2.3°C，降雨集中度提升。",
      disaster: "極端高溫、淹水",
      recommend: "南投鹿谷",
    },
    遊憩: {
      score: 85,
      description: "乾季延長適合山林活動，濕季應避免露營。",
      disaster: "乾旱、落石",
      recommend: "花蓮玉里",
    },
    交通: {
      score: 60,
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

      {/* 內容區塊 */}
      <div className="flex flex-col space-y-4">
        {/* 標題與圓形分數（修正版） */}
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#4b5563"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(current.score / 100) * 220} 220`}
                strokeLinecap="round"
              />
            </svg>
            <div className="relative z-10 text-xl font-bold text-center">
              {current.score}%
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">未來 30 年後 {region}：</h2>
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

        {/* 滑桿（顯示評分） */}
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