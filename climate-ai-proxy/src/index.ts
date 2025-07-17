export default {
  async fetch(req: Request, env: any): Promise<Response> {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'application/json'
        }
      });
    }

    try {
      const { tab, region, score, disaster, recommend } = await req.json();

      const prompt = `你是一位氣候風險顧問，請針對以下資訊，用繁體中文生成一段不超過100字的「${tab}」建議，語氣自然具體：
地區：${region}
得分：${score}
主要氣候風險：${disaster}
推薦地點：${recommend}`;

      // ✅ 正確取得 secret
      const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "你是一位氣候顧問，請用繁體中文回答。" },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!openAIRes.ok) {
        const errorText = await openAIRes.text();
        console.error("OpenAI 錯誤：", errorText);
        return new Response(JSON.stringify({ result: "⚠️ 發生錯誤，請稍後再試。" }), {
          status: 500,
          headers: corsHeaders()
        });
      }

      const data = await openAIRes.json();
      const reply = data?.choices?.[0]?.message?.content || "目前無法取得建議。";

      return new Response(JSON.stringify({ result: reply }), {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("API Error:", err);
      return new Response(JSON.stringify({ result: "⚠️ 發生錯誤，請稍後再試。" }), {
        status: 500,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json"
        }
      });
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
