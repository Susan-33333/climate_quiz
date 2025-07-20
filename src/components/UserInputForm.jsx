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
    <div className="min-h-screen bg-[#fdf8f4] flex justify-center px-4">
      <div className="w-full max-w-md flex flex-col justify-center py-16">
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-brown-800">填寫基本資料</h1>

          <div>
            <label htmlFor="name" className="block text-xl; font-bold text-brown-700">
              匿稱
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              step="1"
              min="3"
              className="rounded-[36px] w-auto border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-brown-300 focus:outline-none"
            />

          </div>

          <div>
            <label htmlFor="age" className="block text-xl font-bold text-brown-700">
              年齡
            </label>
            <input
              type="number"
              id="age"
              name="age"
              autoComplete="bday"
              value={formData.age}
              onChange={handleChange}
              className="rounded-[36px] w-full border border-gray-300 rounded-xl w-auto px-4 py-3 mt-1 focus:ring-2 focus:ring-brown-300 focus:outline-none"
            />

          </div>

          <div>
            <label htmlFor="county" className="block text-xl font-bold text-brown-700">
              居住地
            </label>
            <select
              id="county"
              name="county"
              autoComplete="address-level1"
              value={formData.county}
              onChange={handleChange}
              className="rounded-[36px] w-full border border-gray-300 rounded-xl w-auto px-4 py-3 mt-1 focus:ring-2 focus:ring-brown-300 focus:outline-none"
            >

              <option value="">請選擇</option>
              {counties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {formData.county && (
            <div>
              <label htmlFor="town" className="block text-xl font-medium text-brown-700">
                鄉鎮市區
              </label>
              <select
                id="town"
                name="town"
                autoComplete="address-level2"
                value={formData.town}
                onChange={handleChange}
                className="rounded-[36px] w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-brown-300 focus:outline-none"
              >
                <option value="">請選擇</option>
                {townMap[formData.county].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        <div>
          <p>

          </p>
        </div>
          <button
            onClick={handleSubmit}
            disabled={!isValid()}
            className={`w-full py-3 px-6 rounded-full rounded-[36px] text-[#ffffff] font-bold text-xl transition h-[35px] relative ${
              isValid()
                ? "bg-[#83482cff] hover:bg-[#83482cff]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            進入世界
          </button>
        </div>
      </div>
    </div>
  );
}
