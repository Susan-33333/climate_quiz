import React from "react";
import RingChart from "./RingChart";
import { marked } from "marked";


import janTemp from "../../data/1月月均溫.json";
import julTemp from "../../data/7月月均溫.json";
import rainIntensity from "../../data/雨日降雨強度分類.json";
import rainDays from "../../data/雨日.json";
import hotExtreme from "../../data/極端高溫持續指數.json";

const TravelTab = ({ data, regionDisplay, advice, loading, userData }) => {
  const getRegionKey = () => {
    if (userData?.county && userData?.town) {
      return `${userData.county.trim()}_${userData.town.trim()}`;
    }
    if (regionDisplay) {
      return regionDisplay.replace(/\s/g, "_").trim();
    }
    return "";
  };
  const regionKey = getRegionKey();

  // 氣候資料
  const jan = janTemp[regionKey] || {};
  const jul = julTemp[regionKey] || {};
  const rain = rainDays[regionKey] || {};
  const rainInt = rainIntensity[regionKey]?.雨日降雨強度分類 || "";
  const hotExtremeBase = hotExtreme[regionKey]?.["極端高溫_基期"];
  const hotExtremeFuture = hotExtreme[regionKey]?.["極端高溫_GWL4.0"];
  const hotExtremeChange = hotExtreme[regionKey]?.["極端高溫_CHANGE"];

  // 雨日數摘要
  const rainBase = rain["雨日rr1_基期"];
  const rainFuture = rain["雨日rr1_GWL4.0"];
  const rainChange = rain["雨日rr1_CHANGE"];
  let rainDesc = "";
  if (rainBase && rainFuture && rainChange) {
    const changeNum = parseInt(rainChange, 10);
    if (changeNum > 0) rainDesc = `增加 ${changeNum} 天`;
    else if (changeNum < 0) rainDesc = `減少 ${Math.abs(changeNum)} 天`;
    else rainDesc = "變化不大";
  } else {
    rainDesc = "資料不足";
  }

  // 強度描述 + icon
  let rainLevelStr = "";
  let rainLevelIcon = "";
  let rainLevelColor = "";
  if (rainInt === "高") {
    rainLevelStr = "降雨事件偏劇烈，旅遊行程需多留意天氣預警。";
    rainLevelIcon = "⛈️";
    rainLevelColor = "text-red-600";
  } else if (rainInt === "中") {
    rainLevelStr = "降雨強度中等，戶外活動請多準備備用衣物。";
    rainLevelIcon = "🌦️";
    rainLevelColor = "text-yellow-600";
  } else if (rainInt === "低") {
    rainLevelStr = "降雨偏溫和，戶外行程影響較小。";
    rainLevelIcon = "🌧️";
    rainLevelColor = "text-blue-600";
  } else {
    rainLevelStr = "降雨強度資料不足。";
    rainLevelIcon = "❓";
    rainLevelColor = "text-gray-400";
  }

  // 極端高溫解釋
  let hotExtremeStr = "";
  if (hotExtremeBase && hotExtremeFuture && hotExtremeChange) {
    const base = parseFloat(hotExtremeBase);
    const fut = parseFloat(hotExtremeFuture);
    const diff = parseFloat(hotExtremeChange);
    hotExtremeStr = `極端高溫日數將從 ${base} 天上升到 ${fut} 天，增加 ${diff} 天，夏季戶外活動需加強防曬與補水。`;
  } else {
    hotExtremeStr = "資料不足。";
  }

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">
        未來 30 年後 {regionDisplay}
      </h2>
      <RingChart score={data.score} />

      {/* 氣候摘要 */}
      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌤️ 未來旅遊氣候摘要</p>
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span>
              最冷月均溫：{jan["1月月均溫_基期"] ?? "—"}°C →{" "}
              <b className="text-red-600">{jan["1月月均溫_GWL4.0"] ?? "—"}</b>°C
              {jan["1月月均溫_CHANGE"] && (
                <span className="text-gray-500">（升高 {jan["1月月均溫_CHANGE"]}°C）</span>
              )}
            </span>
          </li>
          <li>
            <span>
              最熱月均溫：{jul["7月月均溫_基期"] ?? "—"}°C →{" "}
              <b className="text-red-600">{jul["7月月均溫_GWL4.0"] ?? "—"}</b>°C
              {jul["7月月均溫_CHANGE"] && (
                <span className="text-gray-500">（升高 {jul["7月月均溫_CHANGE"]}°C）</span>
              )}
            </span>
          </li>
          <li>
            <span>
              年均雨日數：{rainBase ?? "—"} 天 → <b className="text-blue-600">{rainFuture ?? "—"}</b> 天
              <span className="text-gray-500 ml-2">{rainDesc}</span>
            </span>
          </li>
          <li>
            <span>
              <span className="inline-block w-4">{rainLevelIcon}</span>
              <span className={rainLevelColor + " font-bold"}>
                雨日降雨強度：{rainInt || "—"}
              </span>
              <span className="ml-2 text-xs text-gray-500">{rainLevelStr}</span>
            </span>
          </li>
          <li>
            <span>
              年極端高溫日數：{hotExtremeBase ?? "—"} 天 →{" "}
              <b className="text-red-600">{hotExtremeFuture ?? "—"}</b> 天
              {hotExtremeChange && (
                <span className="text-gray-500">（增加 {hotExtremeChange} 天）</span>
              )}
              <div className="text-xs text-gray-500">{hotExtremeStr}</div>
            </span>
          </li>
        </ul>
      </div>


      {/* AI建議 */}
      <div className="w-full mt-2 bg-gray-100 rounded-md p-2">
        <h3 className="text-sm font-bold mb-1">🤖 AI 建議</h3>
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
