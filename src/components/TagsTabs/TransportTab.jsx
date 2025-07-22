import React from "react";
import RingChart from "./RingChart";

// 用相對路徑 import
import janTemp from "../../data/1月月均溫.json";
import julTemp from "../../data/7月月均溫.json";
import rainIntensity from "../../data/雨日降雨強度分類.json";
import rainDays from "../../data/雨日.json";
import hwdi from "../../data/極端高溫持續指數.json";

const TransportTab = ({ data, regionDisplay, advice, loading }) => {
  // regionDisplay 例： '屏東縣 恆春鎮'
  const region = regionDisplay || "屏東縣 恆春鎮";
  const jan = janTemp[region] || {};
  const jul = julTemp[region] || {};
  const rainInt = rainIntensity[region]?.雨日降雨強度分類 || "未提供";
  const rain = rainDays[region] || {};
  const hwdiVal = hwdi[region]?.GWL4_0 || "未提供";

  // 雨日天數
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

  // 強度描述
  let rainLevelStr = "";
  if (rainInt === "高") {
    rainLevelStr = "降雨事件偏劇烈，外出請注意突發性大雨。";
  } else if (rainInt === "中") {
    rainLevelStr = "降雨強度中等，仍需注意天氣變化。";
  } else if (rainInt === "低") {
    rainLevelStr = "降雨偏溫和，偶有小雨。";
  } else {
    rainLevelStr = "降雨強度資料不足。";
  }

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">
        未來 30 年，你在 {region} 的出行舒適度
      </h2>
      <RingChart score={data.score} />

      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌡️ 氣候趨勢摘要</p>
        <ul className="space-y-1 text-sm">
          <li>
            <span>
              最冷月均溫：{jan["1月月均溫_HIST"]}°C →{" "}
              <b className="text-red-600">{jan["1月月均溫_GWL4.0"]}°C</b>
              <span className="text-gray-500">（升高 {jan["1月月均溫_CHANGE"]}°C）</span>
            </span>
          </li>
          <li>
            <span>
              最熱月均溫：{jul["7月月均溫_HIST"]}°C →{" "}
              <b className="text-red-600">{jul["7月月均溫_GWL4.0"]}°C</b>
              <span className="text-gray-500">（升高 {jul["7月月均溫_CHANGE"]}°C）</span>
            </span>
          </li>
          <li>
            <span>極端高溫持續指數（HWDI）：<b>{hwdiVal}</b>（未來連續高溫事件更常見）</span>
          </li>
          <li>
            <span>
              年均雨日數：{rainBase} 天 →{" "}
              <b className="text-blue-600">{rainFuture}</b> 天
              <span className="text-gray-500">（{rainDesc}）</span>
            </span>
          </li>
          <li>
            <span>
              雨日降雨強度分類：<b>{rainInt}</b>
              <span className="ml-2 text-xs text-gray-500">{rainLevelStr}</span>
            </span>
          </li>
        </ul>
      </div>

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

export default TransportTab;
