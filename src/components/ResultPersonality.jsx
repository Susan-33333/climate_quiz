import { useEffect, useState } from "react";

function ResultPersonality({ userData, onNext }) {
  const [profiles, setProfiles] = useState([]);
  const [matchedProfile, setMatchedProfile] = useState(null);

  useEffect(() => {
    // 1. 載入 JSON 資料
    fetch("/data/personality_profiles.json")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        // 2. 判斷最適人格（假設你把回答存在 userData.answers）
        const matched = matchPersonality(userData.answers, data);
        setMatchedProfile(matched);
      });
  }, [userData]);

  function matchPersonality(userAnswers, profiles) {
    let maxScore = -Infinity;
    let topProfiles = [];

    profiles.forEach((profile) => {
      let score = 0;
      userAnswers.forEach((ans, i) => {
        if (ans === profile.ideal_answers[i]) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        topProfiles = [profile];
      } else if (score === maxScore) {
        topProfiles.push(profile);
      }
    });

    // 隨機挑選若同分
    const randomIndex = Math.floor(Math.random() * topProfiles.length);
    return topProfiles[randomIndex];
  }

  if (!matchedProfile) return <p className="text-center">載入中...</p>;

  const goodMatchName = profiles.find(p => p.id === matchedProfile.good_match)?.name || "？";
  const badMatchName = profiles.find(p => p.id === matchedProfile.bad_match)?.name || "？";

  return (
    <div className="text-center px-4">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        你是：「{matchedProfile.name}」
      </h2>

      <img
        src={`${import.meta.env.BASE_URL}mascot/${matchedProfile.mascot}.png`}
        alt="吉祥物"
        className="w-40 h-auto mx-auto mb-4"
      />

      <p className="text-gray-700 mb-4">{matchedProfile.description}</p>

      <div className="text-sm text-gray-600 mt-6">
        <p>👍 最適合的朋友人格：<strong>{goodMatchName}</strong></p>
        <p>⚠️ 可能難以相處的類型：<strong>{badMatchName}</strong></p>
      </div>

      <button
        onClick={onNext}
        className="mt-8 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
      >
        下一步
      </button>
    </div>
  );
}

export default ResultPersonality;
