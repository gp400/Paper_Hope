import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware";

export function middleware(req: NextRequest) {

  const middlewares = [
    apiKeyMiddleware
  ];

  for (const mw of middlewares) {
    const result = mw(req);

    if (result) {
      return result;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};