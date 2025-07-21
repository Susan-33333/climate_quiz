import React from "react";
import RingChart from "./RingChart";

const TravelTab = ({ data, regionDisplay, advice, loading }) => (
  <div className="flex flex-col items-center space-y-4 pt-4 text-left">
    <h2 className="text-xl font-bold text-gray-800">未來 30 年後 {regionDisplay}</h2>
    <RingChart score={data.score} />
    <p className="text-sm text-gray-700">{data.description}</p>
    <div className="text-sm text-gray-800">
      <p className="font-semibold">可能面臨災害：</p>
      <p className="text-gray-600">{data.disaster}</p>
      <p className="font-semibold mt-2">推薦養老地點：</p>
      <p className="text-gray-600">{data.recommend}</p>
    </div>
    <div className="w-full mt-2 bg-gray-100 rounded-md p-2">
      <h3 className="text-sm font-bold mb-1">🤖 AI 建議：</h3>
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

export default TravelTab;
