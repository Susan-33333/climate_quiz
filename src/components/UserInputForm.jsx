import { useEffect, useState } from "react";

export default function UserInputForm({ onNext, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    county: ""
  });

  const [counties, setCounties] = useState([]);

  // ✅ 使用 fetch 載入 geojson 的縣市名稱
  useEffect(() => {
    fetch("/data/taiwan_county.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const countyList = geojson.features.map(
          (feature) => feature.properties.COUNTYNAME
        );
        setCounties([...new Set(countyList)]);
      })
      .catch((err) => {
        console.error("載入 taiwan_county.geojson 失敗", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
    if (onNext) onNext();
    console.log("使用者輸入資料：", formData);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 1: 使用者輸入</h1>

      <div className="mb-4">
        <label className="block text-gray-700">姓名</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">年齡</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">居住縣市</label>
        <select
          name="county"
          value={formData.county}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="">請選擇</option>
          {counties.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        下一步
      </button>
    </div>
  );
}
