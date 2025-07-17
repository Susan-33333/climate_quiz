import { useState } from "react";

function UserInputForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && region) {
      onSubmit({ name, region });
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f4] flex justify-center px-4">
      <div className="w-full max-w-md flex flex-col justify-center py-16 space-y-8">
        <h2 className="text-2xl font-bold text-center text-brown-800">
          請填寫你的基本資訊
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-brown-700">
              你的名字
            </label>
            <input
              type="text"
              value={name}
              placeholder="輸入名稱"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brown-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-brown-700">
              居住縣市
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brown-300"
              required
            >
              <option value="">請選擇</option>
              <option value="台北市">台北市</option>
              <option value="新北市">新北市</option>
              <option value="台中市">台中市</option>
              <option value="高雄市">高雄市</option>
              <option value="花蓮縣">花蓮縣</option>
              {/* 可依需要增加更多縣市 */}
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={!name || !region}
              className={`px-8 py-3 rounded-full text-white text-base font-semibold transition ${
                name && region
                  ? "bg-brown-600 hover:bg-brown-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              開始分析
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserInputForm;
