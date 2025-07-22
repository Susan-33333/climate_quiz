// 以 Vercel Edge Function/Next.js 13+ app/api 寫法為例
import type { NextRequest } from 'next/server';

// 用 dynamic import（Vercel/Next.js 會 tree-shake，只要放在同層 data 資料夾即可）
import janTemp from "./data/1月月均溫.json";
import julTemp from "./data/7月月均溫.json";
import rainDays from "./data/雨日.json";
import rainIntensity from "./data/雨日降雨強度分類.json";
import hotExtreme from "./data/極端高溫持續指數.json";


export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { tab, region } = await req.json();

  // 氣候摘要，tab 可擴充
  const summary = {
    "最冷月均溫": janTemp[region]?.["1月月均溫_基期"] && janTemp[region]?.["1月月均溫_GWL4.0"]
      ? `${janTemp[region]["1月月均溫_基期"]}°C → ${janTemp[region]["1月月均溫_GWL4.0"]}°C`
      : "資料不足",
    "最熱月均溫": julTemp[region]?.["7月月均溫_基期"] && julTemp[region]?.["7月月均溫_GWL4.0"]
      ? `${julTemp[region]["7月月均溫_基期"]}°C → ${julTemp[region]["7月月均溫_GWL4.0"]}°C`
      : "資料不足",
    "年均雨日數": rainDays[region]?.["雨日rr1_基期"] && rainDays[region]?.["雨日rr1_GWL4.0"]
      ? `${rainDays[region]["雨日rr1_基期"]}天 → ${rainDays[region]["雨日rr1_GWL4.0"]}天`
      : "資料不足",
    "雨日降雨強度分類": rainIntensity[region]?.["雨日降雨強度分類"] ?? "資料不足",
    "年極端高溫日數": hotExtreme[region]?.["極端高溫_基期"] && hotExtreme[region]?.["極端高溫_GWL4.0"]
      ? `${hotExtreme[region]["極端高溫_基期"]}天 → ${hotExtreme[region]["極端高溫_GWL4.0"]}天`
      : "資料不足",
  };

  // 組 summary 字串
  const summaryStr = Object.entries(summary)
    .map(([k, v]) => `- ${k}：${v}`)
    .join('\n');

  // 根據 tab 給不同指令
  let userPrompt = '';
  if (tab === "交通") {
    userPrompt = `
你是一位台灣交通與氣候素養科普專家。請參考以下「${region.replace(/_/g, " ")}」的未來氣候趨勢摘要，寫一段交通出行生活建議：
${summaryStr}
1. 請具體描述「氣溫上升、極端高溫、雨日、強降雨」會如何改變當地日常交通情境（如通勤、學校接送、旅遊出遊、假日出行等）。
2. 用容易理解的語言（非學術），每點建議請以實際生活行為舉例，如「夏天外出要避開中午」、「善用大眾運輸」、「記得帶雨具」、「提前查詢天氣、交通狀況」等。
3. 至少給 3 點，最後給一句正向鼓勵或貼心提醒。
`;
  } else if (tab === "旅遊") {
    userPrompt = `
你是一位台灣氣候旅遊諮詢員。請根據以下「${region.replace(/_/g, " ")}」未來氣候摘要，為到此旅遊的人提供未來 30 年的旅遊建議：
${summaryStr}
1. 講明白什麼氣候變遷衝擊會讓旅遊行程、活動、服裝、交通安排有什麼不同（如天氣變化更大、溫度更高、強降雨變多等）。
2. 舉例適合的旅遊方式或地點（如清晨行程、選擇有遮蔽步道、大眾運輸等），並提醒需注意或攜帶的用品。
3. 至少給 3 點，收尾要能增加遊客安心感。
`;
  } else {
    // 居住
    userPrompt = `
你是一位台灣在地生活科普達人。針對以下「${region.replace(/_/g, " ")}」的未來氣候趨勢摘要，請為在地居民寫出 3 點居住生活調適建議：
${summaryStr}
1. 聚焦於居家安全、防熱防雨、防災、防中暑、長者/幼童照護等日常具體建議。
2. 每點都要生活化舉例（如「可安裝遮陽簾」、「提升居家通風」、「雨季要注意積水」等）。
3. 內容務實、積極，最後給一句貼心提醒。
`;
  }

  // TODO: 串接 OpenAI/OpenRouter/其他 LLM，這裡用 placeholder 回覆
  // const aiResult = await callLLM(userPrompt);
  const aiResult = "（這裡是 LLM 實際生成的生活化、分場景交通/旅遊/居住建議，會自動帶入上述摘要重點）";

  return new Response(JSON.stringify({ result: aiResult }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
