export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, age, location, answers } = req.body;

    // 👉 在這裡計算分數或查資料庫
    const result = {
      totalScore: 78,
      tags: ["residence", "travel"],
    };

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
