export default async function handler(req, res) {
  // 處理預請求（CORS）
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { tab, region, score, disaster, recommend } = req.body;

    const prompt = `你是一位氣候風險顧問，請針對以下資訊，用繁體中文生成一段不超過100字的「${tab}」建議，語氣自然具體：
地區：${region}
得分：${score}
主要氣候風險：${disaster}
推薦地點：${recommend}`;

    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "你是一位氣候顧問，請用繁體中文回答。" },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "目前無法取得建議。";

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ result: reply });
  } catch (err) {
    console.error("API Error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ result: "⚠️ 發生錯誤，請稍後再試。" });
  }
}
