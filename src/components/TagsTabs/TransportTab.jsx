import React from "react";
import RingChart from "./RingChart";

import janTemp from "../../data/1月月均溫.json";
import julTemp from "../../data/7月月均溫.json";
import rainDays from "../../data/雨日.json";
import rainIntensity from "../../data/雨日降雨強度分類.json";
import hwdi from "../../data/極端高溫持續指數.json";

// regionDisplay 可能是 "新北市 新店區" 但你的 JSON 用 "_" 連接
const regionKey = (regionDisplay) => regionDisplay?.replace(/\s+/g, "_");

function readableChange(change) {
  const n = parseFloat(change);
  if (isNaN(n)) return "無明顯變化";
  if (n > 0.1) return `增加${n.toFixed(1)}`;
  if (n < -0.1) return `減少${Math.abs(n).toFixed(1)}`;
  return "幾乎不變";
}

const TransportTab = ({ data, regionDisplay, advice, loading }) => {
  const region = regionKey(regionDisplay);

  // 1月均溫
  const jan = janTemp[region] || {};
  // 7月均溫
  const jul = julTemp[region] || {};
  // 年雨日數
  const rain = rainDays[region] || {};
  // 年強降雨天數
  const rainInt = rainIntensity[region] || {};
  // 極端高溫持續指數
  const hwdiVal = hwdi[region];

  const janChange = readableChange(jan["1月月均溫_CHANGE"]);
  const julChange = readableChange(jul["7月月均溫_CHANGE"]);
  const rainChange = readableChange(rain["change"]);
  const heavyRainChange = readableChange(rainInt["強降雨天數_CHANGE"]);
  const heavyRainDays = rainInt["強降雨天數_GWL4_0"] || "—";

  const trends = [
    {
      label: "最冷月均溫",
      value: jan["1月月均溫_基期"] && jan["1月月均溫_GWL4.0"]
        ? `由 ${jan["1月月均溫_基期"]}°C 升高至 ${jan["1月月均溫_GWL4.0"]}°C（${janChange}°C）`
        : "資料不足"
    },
    {
      label: "最熱月均溫",
      value: jul["7月月均溫_基期"] && jul["7月月均溫_GWL4.0"]
        ? `由 ${jul["7月月均溫_基期"]}°C 升高至 ${jul["7月月均溫_GWL4.0"]}°C（${julChange}°C）`
        : "資料不足"
    },
    {
      label: "年雨日數",
      value: rain["baseline"] && rain["GWL4_0"]
        ? `由每年 ${rain["baseline"]} 天變成 ${rain["GWL4_0"]} 天（${rainChange}天）`
        : "資料不足"
    },
    {
      label: "強降雨天數",
      value: heavyRainDays !== "—"
        ? `未來每年有 ${heavyRainDays} 天強降雨（${heavyRainChange}天）`
        : "資料不足"
    },
    {
      label: "極端高溫持續指數（HWDI）",
      value: hwdiVal?.["極端高溫_基期"] && hwdiVal?.["極端高溫_GWL4.0"]
        ? `每年從 ${hwdiVal["極端高溫_基期"]} 天暴增到 ${hwdiVal["極端高溫_GWL4.0"]} 天`
        : "資料不足"
    }
  ];

  const bodyFeel = (
    <div className="text-sm text-gray-700 my-2 leading-relaxed">
      <p>
        <b>高溫暴增</b>會讓夏天在戶外等車、騎車、走路，體感酷熱時間變長，
        甚至中午前後盡量減少外出；冬天也比過去溫暖。<br />
        <b>雨日變化</b>、<b>強降雨天數</b>增多或減少，代表平常出門需準備雨具、
        下大雨時需特別注意淹水或交通延誤。<br />
        <b>極端高溫持續天數（HWDI）</b>升高，表示一年中「連續幾天都超熱」的機會變多，
        可能影響你的上下班、假日出遊計劃，長時間戶外活動要格外注意防曬與補水。
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">
        未來 30 年，你在 {regionDisplay} 的出行舒適度
      </h2>

      <RingChart score={data?.score} />

      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌡️ 氣候趨勢摘要</p>
        <ul className="space-y-1 text-sm">
          {trends.map((item) => (
            <li key={item.label}>
              <b>{item.label}：</b>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
        {bodyFeel}
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
