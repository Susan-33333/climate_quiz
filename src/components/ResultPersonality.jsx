import { useEffect, useState } from "react";

function ResultPersonality({ userData, onNext }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.answers) {
      console.error("沒有答案數據");
      return;
    }

    // 載入外部 JSON 資料
    fetch(`${import.meta.env.BASE_URL}data/personality_profiles.json`)
      .then((res) => res.json())
      .then((data) => {
        processPersonality(data);
      })
      .catch((error) => {
        console.error("載入人格資料失敗", error);
        setLoading(false);
      });

    function processPersonality(data) {
      const count = { A: 0, B: 0, C: 0, D: 0 };
      userData.answers.forEach((ans) => {
        if (count[ans] !== undefined) {
          count[ans]++;
        }
      });

      const maxOption = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
      const personalityMap = { A: "T1", B: "T2", C: "T3", D: "T4" };
      const personalityKey = personalityMap[maxOption] || "T1";

      if (data[personalityKey]) {
        const profileData = data[personalityKey];
        profileData.image = `${import.meta.env.BASE_URL}${profileData.image}`;
        setProfile(profileData);
      } else {
        console.error("找不到人格資料:", personalityKey);
      }
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">正在分析您的氣候人格...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-gray-600">無法載入您的人格分析結果</p>
          <button
            onClick={onNext}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            繼續
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
          {/* 吉祥物圖片 */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-28 h-28 object-cover rounded-full transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error("圖片載入失敗:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="absolute -top-2 -right-2 text-4xl">🌳</div>
            <div className="absolute -bottom-2 -left-2 text-3xl">🍃</div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            你是 {profile.name}！
          </h2>

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">行動方式</h3>
            <p className="text-gray-700 leading-relaxed">{profile.description}</p>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">回答特質</h3>
            <p className="text-gray-700 leading-relaxed">{profile.speciality}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-400">
              <p className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="text-xl mr-2">✅</span> 適合環境
              </p>
              <p className="text-green-700 text-sm">{profile.match}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
              <p className="font-semibold text-red-800 mb-2 flex items-center">
                <span className="text-xl mr-2">❌</span> 避免環境
              </p>
              <p className="text-red-700 text-sm">{profile.mismatch}</p>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            探索我的氣候適應力 🌍
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          接下來將為您分析居住、交通、旅遊三大領域的氣候適應建議
        </p>
      </div>
    </div>
  );
}

export default ResultPersonality;
