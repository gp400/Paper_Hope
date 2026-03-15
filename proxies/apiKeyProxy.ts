import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function apiKeyProxy(req: NextRequest) {
  const apiKey = req.headers.get("X-API-KEY");

  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}