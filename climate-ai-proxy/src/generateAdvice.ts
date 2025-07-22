export default {
  async fetch(req: Request, env: any): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        },
      });
    }

    try {
      // 解析 payload
      const { tab, region } = await req.json();

      // 動態讀取 public/data 的所有 json
      async function loadJson(file: string) {
        const baseUrl = new URL(req.url);
        const origin = `${baseUrl.protocol}//${baseUrl.host}`;
        const url = `${origin}/data/${file}`;
        const resp = await fetch(url);
        if (!resp.ok) return null;
        return await resp.json();
      }
      const [janTemp, julTemp, rainDays, rainIntensity, hotExtreme] = await Promise.all([
        loadJson("1月月均溫.json"),
        loadJson("7月月均溫.json"),
        loadJson("雨日.json"),
        loadJson("雨日降雨強度分類.json"),
        loadJson("極端高溫持續指數.json"),
      ]);

      // 氣候摘要
      const summary = {
        "最冷月均溫": janTemp?.[region]?.["1月月均溫_基期"] && janTemp?.[region]?.["1月月均溫_GWL4.0"]
          ? `${janTemp[region]["1月月均溫_基期"]}°C → ${janTemp[region]["1月月均溫_GWL4.0"]}°C`
          : "資料不足",
        "最熱月均溫": julTemp?.[region]?.["7月月均溫_基期"] && julTemp?.[region]?.["7月月均溫_GWL4.0"]
          ? `${julTemp[region]["7月月均溫_基期"]}°C → ${julTemp[region]["7月月均溫_GWL4.0"]}°C`
          : "資料不足",
        "年均雨日數": rainDays?.[region]?.["雨日rr1_基期"] && rainDays?.[region]?.["雨日rr1_GWL4.0"]
          ? `${rainDays[region]["雨日rr1_基期"]}天 → ${rainDays[region]["雨日rr1_GWL4.0"]}天`
          : "資料不足",
        "雨日降雨強度分類": rainIntensity?.[region]?.["雨日降雨強度分類"] ?? "資料不足",
        "年極端高溫日數": hotExtreme?.[region]?.["極端高溫_基期"] && hotExtreme?.[region]?.["極端高溫_GWL4.0"]
          ? `${hotExtreme[region]["極端高溫_基期"]}天 → ${hotExtreme[region]["極端高溫_GWL4.0"]}天`
          : "資料不足",
      };
      const summaryStr = Object.entries(summary).map(([k, v]) => `- ${k}：${v}`).join('\n');

      // 各tab的prompt
      let userPrompt = '';
      if (tab === "交通") {
        userPrompt = `
你是一位台灣交通與氣候素養科普專家。請參考以下「${region.replace(/_/g, " ")}」的未來氣候趨勢摘要，寫一段交通出行生活建議：
${summaryStr}
1. 請具體描述「氣溫上升、極端高溫、雨日、強降雨」會如何改變當地日常交通情境（如通勤、學校接送、旅遊出遊、假日出行等）。
2. 用容易理解的語言（非學術），每點建議請以實際生活行為舉例，如「夏天外出要避開中午」、「善用大眾運輸」、「記得帶雨具」、「提前查詢天氣、交通狀況」等。
3. 至少給 3 點，最後給一句正向鼓勵或貼心提醒。`;
      } else if (tab === "旅遊") {
        userPrompt = `
你是一位台灣氣候旅遊諮詢員。請根據以下「${region.replace(/_/g, " ")}」未來氣候摘要，為到此旅遊的人提供未來 30 年的旅遊建議：
${summaryStr}
1. 講明白什麼氣候變遷衝擊會讓旅遊行程、活動、服裝、交通安排有什麼不同（如天氣變化更大、溫度更高、強降雨變多等）。
2. 舉例適合的旅遊方式或地點（如清晨行程、選擇有遮蔽步道、大眾運輸等），並提醒需注意或攜帶的用品。
3. 至少給 3 點，收尾要能增加遊客安心感。`;
      } else {
        userPrompt = `
你是一位台灣在地生活科普達人。針對以下「${region.replace(/_/g, " ")}」的未來氣候趨勢摘要，請為在地居民寫出 3 點居住生活調適建議：
${summaryStr}
1. 聚焦於居家安全、防熱防雨、防災、防中暑、長者/幼童照護等日常具體建議。
2. 每點都要生活化舉例（如「可安裝遮陽簾」、「提升居家通風」、「雨季要注意積水」等）。
3. 內容務實、積極，最後給一句貼心提醒。`;
      }

      // 串接 OpenAI GPT
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
            { role: "system", content: "你是一位專業科普作家，專門把台灣氣候趨勢轉為民眾容易懂的生活建議。請用繁體中文回答。" },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      const data = await openAIRes.json();
      const advice = data?.choices?.[0]?.message?.content || "⚠️ 內容生成失敗，請稍後再試。";

      return new Response(JSON.stringify({ result: advice }), {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("AI 建議 API 錯誤：", err);
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
    "Access-Control-Allow-Origin": "https://susan-33333.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
