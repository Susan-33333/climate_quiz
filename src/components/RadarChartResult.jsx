import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

export default function RadarChartResult({ userData }) {
  const data = [
    { subject: "居住", A: userData.homeScore || 60 },
    { subject: "旅遊", A: userData.travelScore || 70 },
    { subject: "交通", A: userData.transportScore || 50 },
  ];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">你的氣候綜合能力圖</h2>
      <RadarChart outerRadius={90} width={400} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="你" dataKey="A" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      </RadarChart>
    </div>
  );
}
