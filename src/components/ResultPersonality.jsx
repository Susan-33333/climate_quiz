import { useEffect, useState } from "react";

function ResultPersonality({ userData, onNext }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/personality_profiles.json`)
      .then((res) => res.json())
      .then((data) => {
        // 統計 ABCD 選項數量
        const count = { A: 0, B: 0, C: 0, D: 0 };
        userData.answers.forEach((ans) => {
          if (count[ans]) {
            count[ans]++;
          } else {
            count[ans] = 1;
          }
        });

        // 找出最多的選項
        const maxOption = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];

        // 選項對應人格代碼
        const personalityMap = {
          A: "T1",
          B: "T2",
          C: "T3",
          D: "T4",
        };

        const personalityKey = personalityMap[maxOption] || "T1"; // 預設T1
        setProfile(data[personalityKey]);
      });
  }, [userData.answers]);

  if (!profile) return <p className="text-center">載入中...</p>;

  return (
    <div className="relative p-4 min-h-screen bg-green-50 flex flex-col items-center justify-center">
      {/* 背景圖層 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}assets/mascot/${profile.image})`,
        }}
      />

      {/* 文字層 */}
      <div className="relative z-10 text-center max-w-lg p-6 bg-white/90 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-4">你是 {profile.name}</h2>
        <p className="mb-2">{profile.description}</p>
        <div className="flex justify-between text-lg mt-6">
          <div>
            <p className="font-semibold">適合：</p>
            <p>{profile.match}</p>
          </div>
          <div>
            <p className="font-semibold">不適合：</p>
            <p>{profile.mismatch}</p>
          </div>
        </div>
        <button
          onClick={onNext}
          className="mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          下一步
        </button>
      </div>
    </div>
  );
}

export default ResultPersonality;