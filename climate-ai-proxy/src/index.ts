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

    if (url.pathname === "/api/generate-advice") {
      return generateAdvice.fetch(req, env, ctx);
    }

    if (url.pathname === "/api/generate-story") {
      return generateStory.fetch(req, env, ctx);
    }

    // ✨ 加上 CORS headers 的 404 fallback
    return new Response("404 Not Found", {
      status: 404,
      headers: corsHeaders(),
    });
  },
};
