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

    // 預設的角色資料，包含滴答浣熊等4種角色
    const defaultProfiles = {
      T1: {
        name: "滴答浣熊",
        description: "喜歡雨天的靜謐節奏，推廣雨水回收與都市友善排水設計，是柔性適應型的生活行動者",
        speciality: "不怕下雨，能接受一週多日陰雨；對濕氣有高忍耐力但怕悶熱；喜歡水氣充足的環境",
        match: "濕潤氣候友善區、濕地社區、排水良好社區",
        mismatch: "乾旱或高溫地區、排水不良區域",
        image: `${import.meta.env.BASE_URL}mascot/T1.png`,
        // 針對不同領域的偏好
        preferences: {
          residence: "濕潤氣候友善區、濕地社區、排水良好社區優先",
          transport: "願意雨中步行或搭車，不喜歡在雨中騎車或等待交通",
          tourism: "偏好雨林、瀑布、濕地，避開乾旱或高溫地區，喜歡有雨的浪漫行程"
        }
      },
      T2: {
        name: "陽光狐狸",
        description: "熱愛陽光與戶外活動，積極推廣太陽能與綠色能源，是主動適應型的環保實踐者",
        speciality: "喜歡晴朗天氣，對高溫有良好適應力；偏好乾燥環境但需要充足日照",
        match: "太陽能社區、乾燥氣候區、戶外活動豐富地區",
        mismatch: "長期陰雨地區、高濕度環境",
        image:`${import.meta.env.BASE_URL}mascot/T2.png`,
        preferences: {
          residence: "日照充足地區、太陽能友善社區、乾燥氣候優先",
          transport: "偏好騎自行車、步行，喜歡戶外交通方式",
          tourism: "偏好沙漠、高原、陽光海灘，避開多雨或陰霾地區"
        }
      },
      T3: {
        name: "智慧貓頭鷹",
        description: "善於分析氣候數據，推動科技創新解決環境問題，是理性分析型的未來規劃者",
        speciality: "對溫度變化敏感，偏好穩定的氣候環境；重視數據分析與科學決策",
        match: "科技園區、氣候穩定區、創新研發社區",
        mismatch: "氣候極端變化地區、缺乏科技支援區域",
        image: `${import.meta.env.BASE_URL}mascot/T3.png`,
        preferences: {
          residence: "氣候穩定區、科技發達社區、創新園區優先",
          transport: "偏好智能交通、共享運輸，重視效率與環保",
          tourism: "偏好科技館、生態研究中心、氣候觀測站"
        }
      },
      T4: {
        name: "堅韌橡樹",
        description: "深耕在地社區，推動傳統智慧與現代環保結合，是穩定守護型的生態守護者",
        speciality: "對環境變化有很強適應力，偏好四季分明的氣候；重視傳統與創新平衡",
        match: "農業社區、生態保護區、傳統文化保存地",
        mismatch: "過度開發地區、缺乏綠地的都市區",
        image:`${import.meta.env.BASE_URL}mascot/T4.png`,
        preferences: {
          residence: "農業友善區、生態社區、傳統文化保存地優先",
          transport: "偏好大眾運輸、在地交通，重視社區連結",
          tourism: "偏好農場體驗、生態保護區、傳統文化景點"
        }
      }
    };

    // 嘗試從JSON文件加載，如果失敗則使用預設資料
    fetch(`${import.meta.env.BASE_URL}data/personality_profiles.json`)
      .then((res) => res.json())
      .then((data) => {
        processPersonality(data);
      })
      .catch((error) => {
        console.error("載入人格資料失敗", error);
        processPersonality(defaultProfiles);
      });

    function processPersonality(data) {
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
        A: "T1", // 滴答浣熊
        B: "T2", // 陽光狐狸
        C: "T3", // 智慧貓頭鷹
        D: "T4", // 堅韌橡樹
      };

      const personalityKey = personalityMap[maxOption] || "T1";
      console.log("人格代碼:", personalityKey);
      
      if (data[personalityKey]) {
        setProfile(data[personalityKey]);
      } else {
        console.error("找不到人格資料:", personalityKey);
        setProfile(defaultProfiles[personalityKey] || defaultProfiles.T1);
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
        {/* 主要內容卡片 */}
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
          {/* 吉祥物圖片 - 半隱藏效果 */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={`${import.meta.env.BASE_URL}assets/mascot/${profile.image}`}
                alt={profile.name}
                className="w-28 h-28 object-cover rounded-full transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error("圖片載入失敗:", e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
            {/* 樹木裝飾效果 */}
            <div className="absolute -top-2 -right-2 text-4xl">🌳</div>
            <div className="absolute -bottom-2 -left-2 text-3xl">🍃</div>
          </div>
          
          <h2 className="text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            你是 {profile.name}！
          </h2>
          
          {/* 行動方式描述 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">行動方式</h3>
            <p className="text-gray-700 leading-relaxed">
              {profile.description}
            </p>
          </div>

          {/* 回答特質 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">回答特質</h3>
            <p className="text-gray-700 leading-relaxed">
              {profile.speciality}
            </p>
          </div>
          
          {/* 適合與不適合 */}
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

        {/* 底部提示 */}
        <p className="mt-6 text-gray-500 text-sm">
          接下來將為您分析居住、交通、旅遊三大領域的氣候適應建議
        </p>
      </div>
    </div>
  );
}

export default ResultPersonality;