export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const { tab, region, score, disaster, recommend } = body;

    const prompt = `你是一位氣候風險顧問，請針對以下資訊，用繁體中文生成一段不超過100字的「${tab}」建議，語氣自然具體：
地區：${region}
得分：${score}
主要氣候風險：${disaster}
推薦地點：${recommend}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "目前無法取得建議。";

    return new Response(JSON.stringify({ result: reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return new Response(JSON.stringify({ result: "⚠️ 發生錯誤，請稍後再試。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
