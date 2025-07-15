import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

function RadarChartResult({ scores, mascot, regionSummary }) {

  const data = [
    { category: "幸福度", value: scores.happiness },
    { category: "氣候適應", value: scores.adaptability },
    { category: "居住環境", value: scores.residence },
    { category: "交通綠能", value: scores.transport },
    { category: "旅遊分數", value: scores.tourism },
  ];

  const barItems = [
    { label: "幸福度", key: "happiness" },
    { label: "開心度", key: "joy" },
    { label: "探索欲", key: "explore" },
  ];

  const downloadImage = async () => {
    const node = document.getElementById("result-card");
    const canvas = await html2canvas(node);
    const link = document.createElement("a");
    link.download = "climate_result.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div id="result-card" className="bg-[#faf7ef] min-h-screen px-4 py-10 relative">
      {/* 五角雷達圖 */}
      <div className="w-[250px] h-[250px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={80} width={300} height={250} data={data}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="category" />
            <Radar name="score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 三條拉桿示意 */}
      <div className="mt-6 space-y-4 max-w-sm mx-auto">
        {barItems.map(({ label, key }, i) => (
          <div key={i}>
            <p className="text-lg font-bold">{label}</p>
            <div className="w-full h-3 bg-gray-200 rounded relative">
              <div
                className="h-3 bg-yellow-500 rounded absolute"
                style={{ width: `${scores[key] || 0}%` }}
              />
              <div
                className="w-3 h-3 bg-black absolute top-0.5 rounded-full"
                style={{ left: `calc(${scores[key] || 0}% - 6px)` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 角色圖片與描述 */}
      <div className="mt-8 flex justify-center">
        {mascot?.image && (
          <img
            src={`${import.meta.env.BASE_URL}assets/mascot/${mascot.image}`}
            alt="你的代表角色"
            className="w-[120px] h-auto"
          />
        )}

      </div>
      <div className="mt-4 text-center text-xl">{regionSummary}</div>

      {/* 下載按鈕 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={downloadImage}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          下載圖片 / 分享到 IG
        </button>
      </div>
    </div>
  );
}
console.log("🐾 RadarChartResult loaded", { scores, mascot, regionSummary });
export default RadarChartResult;
