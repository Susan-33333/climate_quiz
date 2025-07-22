import React from "react";
import RingChart from "./RingChart";
import { AlertTriangle, RefreshCw } from "lucide-react";

const TransportTab = ({ data, regionDisplay, advice, loading, onRetry }) => (
  <div className="flex flex-col items-center space-y-4 pt-4 text-left w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold text-gray-800">
      未來 30 年，你在 {regionDisplay} 的交通氣候風險
    </h2>
    <div className="flex items-center space-x-2">
      <RingChart score={data.score} />
      <span className="text-2xl">
        {data.score > 80 ? "🚗" : data.score > 60 ? "🚲" : data.score > 40 ? "🚌" : "🚶"}
      </span>
    </div>
    <p className="text-sm text-gray-700">{data.description}</p>

    {/* 區塊一：氣候災害 */}
    <div className="bg-white rounded-lg shadow p-3 w-full">
      <div className="flex items-center mb-1">
        <AlertTriangle className="w-4 h-4 text-orange-400 mr-1" />
        <span className="font-semibold text-sm">可能面臨災害</span>
      </div>
      <p className="text-gray-600 text-sm">{data.disaster}</p>
    </div>

    {/* 區塊二：推薦養老地點 */}
    <div className="bg-white rounded-lg shadow p-3 w-full">
      <span className="font-semibold text-sm">推薦養老地點</span>
      <p className="text-gray-600 text-sm">{data.recommend}</p>
    </div>

    {/* AI 建議區塊 */}
    <div className="w-full mt-2 bg-gray-100 rounded-md p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold mb-1">🤖 AI 建議</h3>
        {onRetry && (
          <button
            className="text-xs flex items-center space-x-1 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={onRetry}
          >
            <RefreshCw className="w-3 h-3" /> <span>再生建議</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-1">根據你的填答與區域自動產生，僅供參考</p>
      {loading ? (
        <p className="text-gray-400 animate-pulse">正在產生建議...</p>
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{advice || "尚無建議。"}</p>
      )}
    </div>
  </div>
);

export default TransportTab;
