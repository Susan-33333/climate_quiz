import React from "react";
import RingChart from "./RingChart";

// 自動化摘要與建議（需要將相關資料從父層傳入，或在這裡加上 props）
const TravelTab = ({ 
  data, 
  regionDisplay, 
  advice, 
  loading,
  climate // <-- 建議新增這個 props 以便傳入 { jan, jul, rainDays, rainLevel, hotExtreme }
}) => {
  // 可以根據氣候數值給出「摘要」或「小提醒」
  const {
    janTemp = {}, // { 基期, GWL4.0, 升高 }
    julTemp = {},
    rainDays = {}, // { 基期, GWL4.0, 變化 }
    rainLevel = "", // '高'/'中'/'低'
    hotExtreme = {}, // { 基期, GWL4.0, 變化 }
  } = climate || {};

  // 自動生成摘要
  const summary = [
    janTemp?.base && janTemp?.future
      ? `最冷月均溫：${janTemp.base}°C → ${janTemp.future}°C（升高 ${janTemp.change ?? "-"}°C）`
      : null,
    julTemp?.base && julTemp?.future
      ? `最熱月均溫：${julTemp.base}°C → ${julTemp.future}°C（升高 ${julTemp.change ?? "-"}°C）`
      : null,
    rainDays?.base && rainDays?.future
      ? `年均雨日數：${rainDays.base} 天 → ${rainDays.future} 天（${rainDays.change > 0 ? `增加 ${rainDays.change}` : `減少 ${Math.abs(rainDays.change)}` } 天）`
      : null,
    rainLevel
      ? `雨日降雨強度：${rainLevel === "高" ? "強降雨偏多，外出旅遊請注意突發大雨。" :
         rainLevel === "中" ? "降雨強度中等，出行仍建議帶雨具。" :
         "降雨偏溫和，戶外旅遊較舒適。"}`
      : null,
    hotExtreme?.base && hotExtreme?.future
      ? `極端高溫日數：${hotExtreme.base} 天 → ${hotExtreme.future} 天（增加 ${hotExtreme.change ?? "-"} 天）`
      : null,
  ].filter(Boolean);

  // 自動生成的生活提醒
  const suggestions = [
    (hotExtreme?.future > 80 || julTemp?.future > 30) && "旅遊建議選擇早上或傍晚進行戶外活動，避開中午時段並做好防曬補水。",
    rainLevel === "高" && "建議旅遊時隨身攜帶雨具、備用鞋襪，戶外活動前留意天氣警報。",
    rainDays?.future > 120 && "雨天變多，請多規劃室內景點、或查詢即時交通。",
    (hotExtreme?.future > 80 || julTemp?.future > 30) && "夏天容易中暑，記得補充水分、選擇有冷氣或樹蔭的休憩點。",
    rainLevel === "低" && "天氣較穩定，適合安排多元戶外活動。",
    "出遊前善用天氣APP查詢當地預報，調整行程更安心！"
  ].filter(Boolean);

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left">
      <h2 className="text-xl font-bold text-gray-800">
        未來 30 年後 {regionDisplay} 的旅遊氣候趨勢
      </h2>
      <RingChart score={data.score} />
      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌤️ 氣候摘要</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          {summary.map((txt, i) => (
            <li key={i}>{txt}</li>
          ))}
        </ul>
        <p className="text-base font-semibold mt-4 mb-1">🧳 旅遊生活建議</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          {suggestions.map((txt, i) => (
            <li key={i}>{txt}</li>
          ))}
        </ul>
      </div>
      <div className="w-full mt-2 bg-gray-100 rounded-md p-2">
        <h3 className="text-sm font-bold mb-1">🤖 AI 旅遊建議</h3>
        {loading ? (
          <p className="text-gray-400 animate-pulse">正在產生建議...</p>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {advice || "尚無建議。"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TravelTab;
