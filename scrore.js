export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { township, answers } = req.body;

  // 假資料庫：地區對應的基礎分數（三面向）
  const mockDatabase = {
    "台南市安平區": { residence: 60, transport: 75, travel: 50 },
    "新竹縣五峰鄉": { residence: 40, transport: 60, travel: 85 },
    "台北市大安區": { residence: 70, transport: 65, travel: 60 },
  };

  // 查找該地區分數，如果找不到就給預設值
  const base = mockDatabase[township] || {
    residence: 50,
    transport: 50,
    travel: 50,
  };

  // 根據作答加權（模擬：每選 A 就給 +1 分，選項陣列內容暫不處理）
  const answerBonus = answers.length;

  const result = {
    residence: base.residence + answerBonus,
    transport: base.transport + answerBonus,
    travel: base.travel + answerBonus,
    total: base.residence + base.transport + base.travel + 3 * answerBonus,
  };

  return res.status(200).json(result);
}
