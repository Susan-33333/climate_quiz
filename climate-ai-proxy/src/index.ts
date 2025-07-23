import generateAdvice from "./generateAdvice";
import generateStory from "./generateStory";

// CORS for API
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://susan-33333.github.io", // 你要調自己前端網址
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    // 處理預檢 OPTIONS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // API: /api/generate-advice
    if (url.pathname === "/api/generate-advice") {
      return generateAdvice.fetch(req, env, ctx);
    }

    // API: /api/generate-story
    if (url.pathname === "/api/generate-story") {
      return generateStory.fetch(req, env, ctx);
    }

    // ⭐ 其餘全部交給 ASSETS (public/ 目錄下所有檔案)
    // 這行就是讓 /data/xxx.json 這種可以直接被前端 fetch 到
    if (env.ASSETS) {
      return env.ASSETS.fetch(req);
    }

    // 萬一 ASSETS 沒設（不太可能）
    return new Response("404 Not Found", {
      status: 404,
      headers: corsHeaders(),
    });
  },
};
