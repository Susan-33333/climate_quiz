import { useEffect, useState } from "react";

export default function StorySegment({ userData, onNext }) {
  const [story, setStory] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const age = parseInt(userData.age, 10);
    const projectedAge = age + 30;

    const base = import.meta.env.BASE_URL || "/";

    if (projectedAge <= 40) {
      setStory("你是一位年輕的生活探險家，正在學會與氣候共舞...");
      setBgImage(`${import.meta.env.BASE_URL}public/mascot/youth.jpg`);
    } else if (projectedAge <= 65) {
      setStory("你在壯年努力生活，環境的變遷開始對你產生實際影響...");
      setBgImage(`${import.meta.env.BASE_URL}public/mascot/adult.jpg`);
    } else {
      setStory("你已步入老年，回顧自己與世界的關係，思考未來的樣貌...");
      setBgImage(`${import.meta.env.BASE_URL}public/mascot/elder.jpg`);
    }
  }, [userData]);

  return (
    <div
      className="relative bg-cover bg-center text-white p-10 rounded-xl shadow-lg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-sm bg-black/40 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">未來的你⋯⋯</h2>
        <p className="mb-6">{story}</p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          onClick={onNext}
        >
          我準備好了！
        </button>
      </div>
    </div>
  );
}
