import React from "react";
import RingChart from "./RingChart";

// 依你的路徑調整 import
import janTemp from "../../data/1月月均溫.json";
import julTemp from "../../data/7月月均溫.json";
import rainIntensity from "../../data/雨日降雨強度分類.json";
import hwdi from "../../data/極端高溫持續指數.json";
import rainDays from "../../data/雨日.json";

// TransportTab component
const TransportTab = ({ data, regionDisplay, advice, loading }) => {
  // regionDisplay 例： '新北市 新店區'
  const region = regionDisplay?.trim() || "屏東縣 恆春鎮";
  // 你的資料 key 格式為「縣市_鄉鎮市區」
  const regionKey = region.replace(/\s+/g, "_");

  // 各資料源
  const jan = janTemp[region] || {};
  const jul = julTemp[region] || {};
  const rainInt = rainIntensity[region]?.強降雨分級 || "未提供";
  const rainLevelStr = rainIntensity[region]?.分級說明 || "";
  const hwdiData = hwdi[regionKey] || {};
  const rain = rainDays[region] || {};

  // 極端高溫指數
  const hwdiBase = hwdiData["極端高溫_基期"];
  const hwdiFuture = hwdiData["極端高溫_GWL4.0"];
  const hwdiChange = hwdiData["極端高溫_CHANGE"];

  // 雨日
  const rainBase = rain["HIST"];
  const rainFuture = rain["GWL4.0"];
  const rainChange = rain["CHANGE"];
  // 提示用
  let rainDesc = "全年下雨天數減少";
  if (rainChange > 0) rainDesc = "全年下雨天數增加";
  if (rainChange === 0) rainDesc = "全年下雨天數與過去差不多";

  // 取代 NaN 或 undefined 顯示
  const showNum = (val, unit = "") =>
    val === undefined || val === null || isNaN(Number(val)) ? "—" : Number(val).toFixed(1) + unit;

  // 讓描述更貼近日常
  const hotExtremeBase = showNum(hwdiBase, "天");
  const hotExtremeFuture = showNum(hwdiFuture, "天");
  const hotExtremeChange = hwdiChange === undefined ? "" : `（增加 ${showNum(hwdiChange, "天")}）`;

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        未來 30 年，你在 {region} 的出行舒適度
      </h2>

      <RingChart score={data?.score} />

      <div className="bg-white rounded-lg shadow p-3 w-full mt-2">
        <p className="text-base font-semibold mb-2">🌡️ 氣候趨勢摘要（你會感受到的改變）</p>
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <b>冬天變得溫暖，夏天變得更長更悶熱！</b><br />
            一月均溫從 {showNum(jan["1月月均溫_HIST"], "°C")} 升高到 <b className="text-red-600">{showNum(jan["1月月均溫_GWL4.0"], "°C")}</b>
            ，七月均溫從 {showNum(jul["7月月均溫_HIST"], "°C")} 升高到 <b className="text-red-600">{showNum(jul["7月月均溫_GWL4.0"], "°C")}</b>。
            <span className="text-gray-500">（冬天體感像春天、夏天悶熱到讓人不想出門）</span>
          </li>
          <li>
            <b>下雨日數變{rainChange > 0 ? "多" : "少"}，一場雨就像「瞬間大爆發」！</b><br />
            一年下雨天數從 {showNum(rainBase, "天")} 變成 {showNum(rainFuture, "天")}，{rainDesc}。
            <span className="ml-1">每當下雨，多是<b>{rainInt}</b>（{rainLevelStr}）</span>，突然暴雨更常見，影響交通出行。
          </li>
          <li>
            <b>極端高溫日暴增，出門更常碰到「爆熱天」！</b><br />
            以前一年只有 {hotExtremeBase} 是高溫天，未來會有 <b className="text-red-600">{hotExtremeFuture}</b> 這種日子！{hotExtremeChange}
            <span className="text-gray-500">（夏天騎車、走路、等公車常常覺得煎熬）</span>
          </li>
          <li>
            <b>高溫與強降雨，會讓交通更辛苦、更容易塞車或延誤！</b><br />
            熱浪和暴雨不只讓你出門不舒服，還會增加道路積水、塞車、甚至交通中斷的機會。建議多查天氣、規劃備用路線，隨身帶雨具防曬。
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
