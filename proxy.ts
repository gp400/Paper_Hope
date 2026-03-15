import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiKeyProxy } from "./proxies/apiKeyProxy";

export function proxy(req: NextRequest) {

  const middlewares = [
    apiKeyProxy
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