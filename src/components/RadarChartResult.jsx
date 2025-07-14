import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

function RadarChartResult({ scores, mascot, regionSummary }) {
  const data = [
    { subject: "幸福度", A: scores.happiness, fullMark: 100 },
    { subject: "氣候適應", A: scores.adaptability, fullMark: 100 },
    { subject: "居住環境", A: scores.residence, fullMark: 100 },
    { subject: "交通綠能", A: scores.transport, fullMark: 100 },
    { subject: "旅遊分數", A: scores.tourism, fullMark: 100 },
  ];

  const downloadImage = async () => {
    const node = document.getElementById("result-card");
    const canvas = await html2canvas(node);
    const link = document.createElement("a");
    link.download = "climate_result.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  <img
  src={`${import.meta.env.BASE_URL}assets/mascot/${userData.mascotImage}`}
  alt="你的氣候人格角色"
  className="w-36 md:w-48 mx-auto"
/>

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
        {["幸福度", "開心度", "探索欲"].map((label, i) => (
          <div key={i}>
            <p className="text-lg font-bold">{label}</p>
            <div className="w-full h-3 bg-gray-200 rounded relative">
              <div
                className="h-3 bg-yellow-500 rounded absolute"
                style={{ width: `${scores[label] || 0}%` }}
              />
              <div
                className="w-3 h-3 bg-black absolute top-0.5 left-[calc(100%-1rem)] rounded-full"
                style={{ left: `calc(${scores[label] || 0}% - 6px)` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 角色圖片與描述 */}
      <div className="mt-8 flex justify-center">
        <img
          src={`${import.meta.env.BASE_URL}assets/mascot/${mascot.image}`}
          alt="你的代表角色"
          className="w-[120px] h-auto"
        />
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

export default RadarChartResult;
