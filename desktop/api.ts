import * as game from "../app/api/game/route";
import * as sessions from "../app/api/sessions/route";
import * as progress from "../app/api/progress/route";

export async function handle(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  if (request.method === "GET") {
    if (pathname === "/api/game") return game.GET();
    if (pathname === "/api/progress") return progress.GET();
  }
  if (request.method === "POST") {
    if (pathname === "/api/game") return game.POST(request);
    if (pathname === "/api/sessions") return sessions.POST(request);
    if (pathname === "/api/progress") return progress.POST(request);
  }
  return Response.json({error: "Unknown local request."}, {status: 404});
}
