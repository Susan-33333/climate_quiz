// src/generateStory.ts

export default {
  async fetch(req: Request, env: any): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json"
        }
      });
    }

    try {
      const { age } = await req.json();
      const category = age <= 40 ? "青年" : age <= 65 ? "壯年" : "老年";

      const prompt = `你是一位小說家，要為一位${category}角色撰寫一段30年後在GWL4.0氣候變遷情境下的日常故事。請聚焦於氣候變遷對其生活、居住、行為方式的改變，使用自然生動、有情感的敘事語氣，限制在200字以內。`;

      const apiKey = env.OPENAI_API_KEY;

      const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "你是一位小說家，請用繁體中文回答。" },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await openAIRes.json();
      const story = data?.choices?.[0]?.message?.content || "⚠️ 故事生成失敗，請稍後再試。";

      return new Response(JSON.stringify({ result: story }), {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("故事 API 錯誤：", err);
      return new Response(JSON.stringify({ result: "⚠️ 發生錯誤，請稍後再試。" }), {
        status: 500,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        },
      });
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
