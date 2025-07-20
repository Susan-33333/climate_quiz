// RadarChartResult.jsx
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { useState, useEffect } from "react";

function RadarChartResult({ scores, mascot, regionSummary }) {
  console.log("🐾 RadarChartResult loaded", { scores, mascot, regionSummary });

const [scores, setScores] = useState(null);
const [regionScore, setRegionScore] = useState(null);
const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const data = [
    { category: "幸福度", value: scores?.happiness || 0 },
    { category: "調適度", value: scores?.adaptability || 0 },
    { category: "便利度", value: scores?.convenience || 0 },
    { category: "樂活度", value: scores?.live || 0 },
    { category: "舒適度", value: scores?.comfortable || 0 },
  ];

useEffect(() => {
  const fetchRegionScore = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/totalscores.json`);
      const json = await res.json();
      const key = `${userData.county}_${userData.town}`; // 例如「臺北市_信義區」
      const score = json[key]?.綜合 ?? null;
      if (score !== null) setRegionScore(score);
      else console.warn("找不到該地區分數", key);
    } catch (e) {
      console.error("載入分數檔案失敗", e);
    }
  };
  fetchRegionScore();
}, [userData]);
{regionScore !== null && (
  <p className="text-center text-sm text-gray-500 mt-4">
    🌍 你所在區域的氣候綜合評分：<span className="font-bold text-lg">{regionScore}</span> 分
  </p>
)}
  const downloadImage = async () => {
  try {
    const node = document.getElementById("capture-target");
    const canvas = await html2canvas(node, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });

    const dataUrl = canvas.toDataURL("image/png");
    setGeneratedImageUrl(dataUrl);

  } catch (e) {
    console.error("下載錯誤", e);
    alert("下載圖片失敗，請重試");
  }
};

  // 如果沒有分數數據，顯示載入中
  if (!scores) {
    return (
      <div className="bg-[#faf7ef] min-h-screen flex items-center justify-center">
        <p className="text-center text-lg">載入結果中...</p>
      </div>
    );
  }

  return (
    <div id="result-card" className="bg-[#faf7ef] min-h-screen px-4 py-10 relative">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          你的氣候適應性分析
        </h1>
        <div id="capture-target" className="bg-white/80 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-8 mb-6">
            {/* 五角雷達圖 */}
            <div className="w-[300px] h-[300px] mb-6 md:mb-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={100} data={data}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12, fill: '#374151' }}
                  />
                  <Radar 
                    name="score" 
                    dataKey="value" 
                    stroke="#fe92d4ff" 
                    fill="#fdabe5ff" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* 角色圖片與描述 - Moved here for right side prominence */}
            <div className="mt-6 md:mt-0 text-center md:text-left flex-shrink-0">
              {mascot?.image && (
                <div className="flex justify-center md:justify-start mb-4">
                  <img
                    src={mascot.image}
                    alt={mascot.name|| "你的氣候角色"}
                    className="w-[150px] h-auto rounded-lg shadow-lg" /* Slightly larger for prominence */
                    onError={(e) => {
                      console.error("圖片載入失敗:", e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md max-w-xs md:max-w-none">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {mascot?.name || "你的氣候夥伴"}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {regionSummary || "正在分析你的氣候適應性..."}
                </p>
              </div>
              </div>
            </div>
        </div>
        {generatedImageUrl && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">長按下方圖片可儲存到手機相簿</p>
            <img src={generatedImageUrl} className="mt-2 w-full rounded-xl" />
          </div>
        )}
        </div>
      </div>
  );
}

export default RadarChartResult;