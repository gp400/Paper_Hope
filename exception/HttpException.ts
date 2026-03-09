// utils/errors.ts
export class HttpException extends Error {
    constructor(message: string, public status: number) {
        super(message)
    }
}