import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function apiKeyMiddleware(req: NextRequest) {
  const apiKey = req.headers.get("X-API-KEY");

  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}