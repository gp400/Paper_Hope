// utils/globalErrorHandler.ts
import { NextRequest, NextResponse } from "next/server"
import { HttpException } from "./HttpException"

type RouteHandler = (req: NextRequest, context: any) => Promise<Response>

export default function globalErrorHandler(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: Record<string, string> }) => {
        try {
            return await handler(req, context)
        } catch (err) {
            if (err instanceof HttpException) {
                return NextResponse.json(
                    { error: err.message },
                    { status: err.status },
                )
            }

            return NextResponse.json(
                { error: err },
                { status: 400 },
            )
        }
    }
}