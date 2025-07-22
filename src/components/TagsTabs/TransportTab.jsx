import React from "react";
import RingChart from "./RingChart";

import janTemp from "../../data/1月月均溫.json";
import julTemp from "../../data/7月月均溫.json";
import rainIntensity from "../../data/雨日降雨強度分類.json";
import hwdi from "../../data/極端高溫持續指數.json";

const TransportTab = ({ data, regionDisplay, advice, loading, userData }) => {
  // userData 格式：{ county: "新北市", town: "新店區", ... }
  // 優先用 userData 拼 key，沒有才用 regionDisplay
  const regionKey =
    userData?.county && userData?.town
      ? `${userData.county}_${userData.town}`
      : regionDisplay?.replace(/\s/g, "_"); // 若用 regionDisplay 傳進來就把空格換底線
  const jan = janTemp[regionKey] || {};
  const jul = julTemp[regionKey] || {};
  const rain = rainIntensity[regionKey] || {};
  const hwdiVal = hwdi[regionKey]?.GWL4_0 || "未提供";

  // 你原本的手動資料還可以保留
  const warmNightDays = 54;
  const extremeHotDays = 22;
  const rainDays = 102;

  let rainLevelStr = "未來強降雨天數偏多，出行需注意突發大雨";
  if (rain["強降雨天數_GWL4_0"] < 10) rainLevelStr = "強降雨天數較少，降雨以中小雨為主";
  else if (rain["強降雨天數_GWL4_0"] > 25) rainLevelStr = "強降雨日數明顯增加，需注意淹水風險";

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">
        未來 30 年，你在 {regionKey.replace(/_/g, " ")} 的出行舒適度
      </h2>
      <RingChart score={data.score} />
      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌡️ 氣候趨勢摘要</p>
        <ul className="space-y-1 text-sm">
          <li>
            <span>
              最冷月均溫：{jan["1月月均溫_基期"]}°C →{" "}
              <b className="text-red-600">{jan["1月月均溫_GWL4.0"]}</b>°C
              <span className="text-gray-500">
                （升高 {jan["1月月均溫_CHANGE"]}°C）
              </span>
            </span>
          </li>
          <li>
            <span>
              最熱月均溫：{jul["7月月均溫_基期"]}°C →{" "}
              <b className="text-red-600">{jul["7月月均溫_GWL4.0"]}</b>°C
              <span className="text-gray-500">
                （升高 {jul["7月月均溫_CHANGE"]}°C）
              </span>
            </span>
          </li>
          <li>
            <span>
              極端高溫持續指數（HWDI）：<b>{hwdiVal}</b>（未來連續高溫事件更常見）
            </span>
          </li>
          <li>
            <span>
              暖夜天數（&gt;26°C）：<b>{warmNightDays}</b> 天/年
            </span>
          </li>
          <li>
            <span>
              極端高溫天數（&gt;35°C）：<b>{extremeHotDays}</b> 天/年
            </span>
          </li>
          <li>
            <span>
              雨日數：<b>{rainDays}</b> 天/年
            </span>
          </li>
          <li>
            <span>
              強降雨天數：
              <b>{rain["強降雨天數_GWL4_0"] || "未提供"}</b> 天/年
            </span>
            <span className="ml-2 text-xs text-gray-500">{rainLevelStr}</span>
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
