import generateAdvice from "./generateAdvice";
import generateStory from "./generateStory";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://susan-33333.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    // ✅ 這是關鍵！讓 root handler 處理預檢 OPTIONS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (url.pathname === "/api/generate-advice") {
      return generateAdvice.fetch(req, env, ctx);
    }

    if (url.pathname === "/api/generate-story") {
      return generateStory.fetch(req, env, ctx);
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: corsHeaders(),
    });
  },
};
