import { useEffect, useState } from "react";

export default function UserInputForm({ onNext, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    county: "",
    town: ""
  });

  const [townMap, setTownMap] = useState({});
  const [loading, setLoading] = useState(true);

  const counties = Object.keys(townMap);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/town_data.json`)
      .then((res) => res.json())
      .then((data) => {
        setTownMap(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "county" ? { town: "" } : {})
    }));
  };

  const isValid = () => {
    const age = Number(formData.age);
    return (
      formData.name.trim() !== "" &&
      formData.county !== "" &&
      formData.town !== "" &&
      !isNaN(age) &&
      age > 3 && age < 100
    );
  };

  const handleSubmit = () => {
    if (isValid()) {
      onSave?.(formData);
      onNext?.();
    }
  };

  if (loading) return <p className="text-center">載入中...</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">填寫基本資料</h1>

      <div className="mb-4">
        <label className="block text-gray-700">匿稱</label>
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

      <div className="mb-4">
        <label className="block text-gray-700">居住地</label>
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

      {formData.county && (
        <div className="mb-4">
          <label className="block text-gray-700">鄉鎮市區</label>
          <select
            name="town"
            value={formData.town}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          >
            <option value="">請選擇</option>
            {townMap[formData.county].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

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
