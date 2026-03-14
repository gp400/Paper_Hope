// utils/globalErrorHandler.ts
import { NextRequest, NextResponse } from "next/server"
import { HttpException } from "./HttpException"

export default function globalErrorHandler<
    T extends (req: NextRequest, context: { params: Record<string, string> }) => Promise<NextResponse>
>(handler: T) {
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