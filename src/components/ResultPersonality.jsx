import { useEffect, useState } from "react";

function ResultPersonality({ userData, onNext }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("目前 userData", userData);
    
    if (!userData?.answers) {
      console.error("沒有答案數據");
      return;
    }

    fetch(`${import.meta.env.BASE_URL}data/personality_profiles.json`)
      .then((res) => res.json())
      .then((data) => {
        // 統計 ABCD 選項數量
        const count = { A: 0, B: 0, C: 0, D: 0 };
        userData.answers.forEach((ans) => {
          if (count[ans] !== undefined) {
            count[ans]++;
          }
        });

        console.log("選項統計:", count);

        // 找出最多的選項
        const maxOption = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
        console.log("最多選項:", maxOption);

        // 選項對應人格代碼
        const personalityMap = {
          A: "T1",
          B: "T2",
          C: "T3",
          D: "T4",
        };

        const personalityKey = personalityMap[maxOption] || "T1";
        console.log("人格代碼:", personalityKey);
        
        if (data[personalityKey]) {
          setProfile(data[personalityKey]);
        } else {
          console.error("找不到人格資料:", personalityKey);
          // 使用預設資料
          setProfile({
            name: "氣候探索者",
            description: "你是一位對環境變化充滿好奇心的探索者。",
            match: "綠色生活",
            mismatch: "高碳排放",
            image: "T1.png"
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("載入人格資料失敗:", error);
        // 使用預設資料
        setProfile({
          name: "氣候探索者", 
          description: "你是一位對環境變化充滿好奇心的探索者。",
          match: "綠色生活",
          mismatch: "高碳排放",
          image: "T1.png"
        });
        setLoading(false);
      });
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-center text-lg">分析你的人格特質中...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-center text-lg">無法載入人格分析結果</p>
      </div>
    );
  }

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
      <div className="relative z-10 text-center max-w-lg p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="mb-6">
          <img
            src={`${import.meta.env.BASE_URL}assets/mascot/${profile.image}`}
            alt={profile.name}
            className="w-24 h-24 mx-auto rounded-full shadow-lg"
            onError={(e) => {
              console.error("圖片載入失敗:", e.target.src);
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          你是 {profile.name}
        </h2>
        
        <p className="text-lg mb-8 text-gray-600 leading-relaxed">
          {profile.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-green-800 mb-2">✅ 適合：</p>
            <p className="text-green-700">{profile.match}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-semibold text-red-800 mb-2">❌ 不適合：</p>
            <p className="text-red-700">{profile.mismatch}</p>
          </div>
        </div>
        
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          繼續探索 →
        </button>
      </div>
    </div>
  );
}

export default ResultPersonality;