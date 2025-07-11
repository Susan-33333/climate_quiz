export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { township, answers } = req.body;

  const mockDatabase = {
    "台南市安平區": { residence: 60, transport: 75, travel: 50 },
    "新竹縣五峰鄉": { residence: 40, transport: 60, travel: 85 },
    "台北市大安區": { residence: 70, transport: 65, travel: 60 },
  };

  const base = mockDatabase[township] || {
    residence: 50,
    transport: 50,
    travel: 50,
  };

  const bonus = answers.length;

  const result = {
    residence: base.residence + bonus,
    transport: base.transport + bonus,
    travel: base.travel + bonus,
    total: base.residence + base.transport + base.travel + bonus * 3,
  };

  return res.status(200).json(result);
}
