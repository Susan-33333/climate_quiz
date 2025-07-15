// RadarChartResult.jsx
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

function RadarChartResult({ scores, mascot, regionSummary }) {
  console.log("🐾 RadarChartResult loaded", { scores, mascot, regionSummary });

  const data = [
    { category: "幸福度", value: scores?.happiness || 0 },
    { category: "氣候適應", value: scores?.adaptability || 0 },
    { category: "居住環境", value: scores?.residence || 0 },
    { category: "交通綠能", value: scores?.transport || 0 },
    { category: "旅遊分數", value: scores?.tourism || 0 },
  ];

  const barItems = [
    { label: "幸福度", key: "happiness" },
    { label: "開心度", key: "joy" },
    { label: "探索欲", key: "explore" },
  ];

  const downloadImage = async () => {
    try {
      const node = document.getElementById("result-card");
      if (!node) {
        alert("無法找到結果卡片");
        return;
      }
      
      const canvas = await html2canvas(node, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf7ef"
      });
      
      const link = document.createElement("a");
      link.download = "climate_result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("下載圖片失敗：", error);
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
                  stroke="#059669" 
                  fill="#059669" 
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
                  src={`${import.meta.env.BASE_URL}T6.png`} {/* Use T6.png directly */}
                  alt={mascot.name || "你的代表角色"}
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

        {/* 三條拉桿示意 */}
        <div className="mt-8 space-y-4">
          {barItems.map(({ label, key }) => (
            <div key={key} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-medium text-gray-700">{label}</p>
                <span className="text-sm text-gray-500">{scores[key] || 0}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(scores[key] || 0, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 下載按鈕 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={downloadImage}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            📸 下載圖片 / 分享到 IG
          </button>
        </div>
      </div>
    </div>
  );
}

export default RadarChartResult;