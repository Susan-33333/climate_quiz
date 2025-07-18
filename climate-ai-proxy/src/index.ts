import generateAdvice from "./generateAdvice";
import generateStory from "./generateStory";

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/generate-advice") {
      return generateAdvice.fetch(req, env, ctx);
    }

    if (url.pathname === "/api/generate-story") {
      return generateStory.fetch(req, env, ctx);
    }

    return new Response("404 Not Found", { status: 404 });
  },
};
