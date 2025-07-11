import { useState, useEffect } from "react";

export default function UserInputForm({ onNext, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    county: ""
  });
  const [counties, setCounties] = useState([]);

useEffect(() => {
  fetch("/data/county_town_map.json")
    .then(res => res.json())
    .then(data => {
      setCountyTownMap(data);
      setCounties(Object.keys(data));
    });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    const age = Number(formData.age);
    return (
      formData.name.trim() !== "" &&
      formData.county !== "" &&
      !isNaN(age) &&
      age > 3
    );
  };

  const handleSubmit = () => {
    if (isValid()) {
      onSave?.(formData);
      onNext?.();
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">填寫基本資料</h1>

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
        onClick={handleSubmit}
        className={`w-full font-semibold py-2 px-4 rounded text-white ${
          isValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isValid()}
      >
        下一步
      </button>
    </div>
  );
}
